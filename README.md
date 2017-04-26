# node-inist-roadmap
to use our roadmap from trello


## API

### Installation

```shell
npm install inist-roadmap --save
```

### Usage

```js
import { milestones } from 'inist-roadmap';

const url = "http://trello.com/b/nCOeW4SM/lodex-product-backlog";
const opt = {
	token: "dd675dfcf234b0f774584b9b96cf91e23615c4b26b8f3c92988bfa986baebe0b",
	key: "8ca517c389612aa4ca03f783cf2a8241",
}

milestones(url, opt).then((values) => {
	console.log('All milestones', values);
}).catch(consol.error);
```

## CLI

For developpers/testers only

```shell
git clone https://github.com/Inist-CNRS/node-inist-roadmap
cd ./node-inist-roadmap
npm install 
./bin/itr --help
```
