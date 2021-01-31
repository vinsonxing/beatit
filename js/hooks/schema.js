// all schemas are base on lianjia web site
export const houseListSchemas = [
  {
    field: 'title',
    selector: '.sellListContent.LOGCLICKDATA li .title a',
    type: 'String',
  },
  {
    field: 'img',
    selector: '.sellListContent.LOGCLICKDATA li a.img img.lj-lazy',
    type: 'String',
    attribute: 'data-original',
  },
  {
    field: 'detailLink',
    selector: '.sellListContent.LOGCLICKDATA li .title a',
    type: 'String',
    attribute: 'href',
  },
  {
    field: 'positionInfo',
    selector: '.sellListContent.LOGCLICKDATA li .positionInfo a',
    type: 'String',
  },
  {
    field: 'houseInfo',
    selector: '.sellListContent.LOGCLICKDATA li .houseInfo',
    type: 'String',
  },
  {
    field: 'followInfo',
    selector: '.sellListContent.LOGCLICKDATA li .followInfo',
    type: 'String',
  },
  {
    field: 'priceInfo',
    selector: '.sellListContent.LOGCLICKDATA li .priceInfo .totalPrice',
    type: 'String',
  },
  {
    field: 'unitPrice',
    selector: '.sellListContent.LOGCLICKDATA li .priceInfo .unitPrice',
    type: 'String',
  },
  {
    field: 'tag',
    selector: '.sellListContent.LOGCLICKDATA li .tag',
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
