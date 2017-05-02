import Trello from 'trello-promise';
import latinize from 'latinize';
import marked from 'marked';
import tlnp from './trello-list-name-parser';

function convertLists(accu, list) {
  accu[list.id] = {
    listName: list.name,
  };
  const range = tlnp(list.name);
  if (range instanceof Error) {
    accu[list.id] = new Error(`Error: invalid date in list ${list.name} at ${range}`);
  } else {
    accu[list.id].range = range;
    accu[list.id].rangeLabel = `entre ${range[0].format('MMMM YYYY')} et ${range[1].format('MMMM YYYY')}`;
    accu[list.id].date = range[0].add(Math.round(range[1].diff(range[0], 'days') / 2), 'days');
    accu[list.id].dateLabel = accu[list.id].date.format('YYYY-MM-DD');
    accu[list.id].dateLabel2 = accu[list.id].date.format('DD MMM YYYY');
    accu[list.id].dateLabel3 = accu[list.id].date.format('DD MMMM YYYY');
  }
  return accu;
}

function convertCards(accu, card) {
  const obj = {};
  obj.idCard = card.id;
  obj.idList = card.idList;
  // eslint-disable-next-line
  obj.isRange = card.due ? false : true; // si on a une due date alors c'est pas un range de date
  obj.title = card.name;
  obj.desc = marked(card.desc);
  obj.trelloLink = card.url;
  obj.image_small =
    card.attachments.length > 0 && card.attachments[0].previews[0]
    ? card.attachments[0].previews[0].url : '';
  obj.image_medium =
    card.attachments.length > 0 && card.attachments[0].previews[2]
    ? card.attachments[0].previews[2].url : '';
  obj.image_big =
    card.attachments.length > 0 && card.attachments[0].previews[4]
    ? card.attachments[0].previews[4].url : '';
  obj.labelsOriginal = card.labels.map(elt => elt);
  obj.labels = card.labels.map(elt => latinize(elt.name.toLowerCase().trim().replace(/s$/, '').replace(' ', '-')));
  accu.push(obj);
  return accu;
}

module.exports = function millestones(boardLink, options) {
  try {
    const boardID = boardLink.split('/').filter(x => x.length === 8).pop();
    const trello = new Trello(options.key, options.token);
    const r1 = trello.makeRequest('GET', `https://api.trello.com/1/boards/${boardID}`);
    const r2 = trello.makeRequest('GET', `https://api.trello.com/1/boards/${boardID}/lists`);
    const r3 = trello.makeRequest('GET', `https://api.trello.com/1/boards/${boardID}/cards`, { attachments: true });

    return Promise.all([r1, r2, r3]).then(values => new Promise((resolve) => {
      const [info, lists, cards] = values;
      const boardLists = lists.reduce(convertLists, {});
      const boardCards = cards
        .reduce(convertCards, [])
        .map((card) => {
          card.boardName = info.name;
          card.listName = boardLists[card.idList].listName;
          card.rangeLabel = boardLists[card.idList].rangeLabel;
          card.date = boardLists[card.idList].date;
          card.dateLabel = boardLists[card.idList].dateLabel;
          card.dateLabel2 = boardLists[card.idList].dateLabel2;
          card.dateLabel3 = boardLists[card.idList].dateLabel3;
          card.boardLink = boardLink;
          card.projectKey = boardID;
          return card;
        })
        .sort((a, b) => b.date - a.date);
      resolve(boardCards);
    }));
  } catch (err) {
    return Promise.reject(err);
  }
};
