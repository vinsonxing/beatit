import React from 'react';
import {Animated, Dimensions} from 'react-native';
import {PinchGestureHandler, State} from 'react-native-gesture-handler';

const screen = Dimensions.get('window');

const localStyles = {
  imageStyle: {
    width: screen.width,
    height: screen.width * 0.56,
    paddingHorizontal: 10,
  },
};

const PinchableBox = ({imageUri}) => {
  const scale = new Animated.Value(1);
  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: {scale: scale},
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <PinchGestureHandler
      onGestureEvent={onPinchEvent}
      onHandlerStateChange={onPinchStateChange}>
      <Animated.Image
        source={{uri: imageUri}}
        style={[localStyles.imageStyle, {transform: [{scale: scale}]}]}
        resizeMode="contain"
      />
    </PinchGestureHandler>
  );
};

export default PinchableBox;
