// all schemas are base on lianjia web site
export const houseListSchemas = [
  {
    field: 'title',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .title a',
    type: 'String',
  },
  {
    field: 'img',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA a.img img.lj-lazy',
    type: 'String',
    attribute: 'data-original',
  },
  {
    field: 'detailLink',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .title a',
    type: 'String',
    attribute: 'href',
  },
  {
    field: 'positionInfo',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .positionInfo',
    type: 'String',
  },
  {
    field: 'houseInfo',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .houseInfo',
    type: 'String',
  },
  {
    field: 'followInfo',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .followInfo',
    type: 'String',
  },
  {
    field: 'priceInfo',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .priceInfo .totalPrice',
    type: 'String',
  },
  {
    field: 'unitPrice',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .priceInfo .unitPrice',
    type: 'String',
  },
  {
    field: 'tag',
    selector:
      '.sellListContent[data-lj_action_type="list_zaishou"] li.LOGCLICKDATA .tag',
    type: 'StringOfArray',
    moreSelector: 'span',
    separator: ' ',
  },
];

export const houseDetailSchema = [
  {
    field: 'housePic',
    selector: '.m-content .housePic .list img',
    type: 'String',
    attribute: 'src',
  },
];

export const communityDetailScheme = [
  {
    field: 'vill',
    selector: '#sem_card .agentCardSemInfo .agentCardResblockTitle',
    type: 'String',
  },
  {
    field: 'roadarea',
    selector:
      '#sem_card .agentCardSemInfo .agentCardResblockTitle .agentCardResblockSubTitle',
    type: 'String',
  },
];
