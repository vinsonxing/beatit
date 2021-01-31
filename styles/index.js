export const Colors = {
  lightSilver: '#D7D7D7',
  primary: '#2089dc',
  secondary: '#ca71eb',
  white: '#ffffff',
  black: '#242424',
  grey0: '#393e42',
  grey1: '#43484d',
  grey2: '#5e6977',
  grey3: '#86939e',
  grey4: '#bdc6cf',
  grey5: '#e1e8ee',
  greyOutline: '#bbb',
  searchBg: '#303337',
  success: '#52c41a',
  error: '#ff190c',
  warning: '#faad14',
  red: '#ff0000',
  disabled: 'hsl(208, 8%, 90%)',
};

export const Styles = {
  FlexOne: {
    flex: 1,
  },
  FullScreen: {
    height: '100%',
    width: '100%',
  },
  FlexRowDirection: {
    flexDirection: 'row',
  },
  Center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  LoadingStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    backgroundColor: Colors.grey5,
    opacity: 0.5,
  },
  Color: (c) => ({color: c || Colors.black}),
  BackgroundColor: (c) => ({
    backgroundColor: c || Colors.lightSilver,
  }),
  PaddingHorizontal: (size) => ({
    paddingHorizontal: 10,
  }),
};

export default {
  Styles,
  Colors,
};
