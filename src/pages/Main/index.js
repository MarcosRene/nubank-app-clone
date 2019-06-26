import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { Animated } from 'react-native'
import { PanGestureHandler, State } from 'react-native-gesture-handler'

import Header from '~/components/Header'
import Tabs from '~/components/Tab'
import Menu from '~/components/Menu'

import { Text } from 'react-native'

import { 
  Container,
  Content,
  Card,
  CardHeader,
  CardContent,
  Title,
  Description,
  CardFooter,
  Annotation
} from './styles'


export default function Main() { 
  let offset = 0;
  const translateY = new Animated.Value(0);

  const animatedEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationY: translateY,
        }
      }
    ],
    {
      useNativeDriver: true
    },
  )

  function onHandlerStateChange(event){
    if(event.nativeEvent.oldState === State.ACTIVE){
      let opened = false;
      const { translateY } = event.nativeEvent;

      offset += translateY;

      if(translateY >= 100){
        opened = true;
      } else {
        translateY.setValue(offset);
        translateY.setOffset(0);
        offset = 0;
      }

      Animated.timing(translateY, {
        toValue: opened ? 380 : 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => {
        offset = opened ? 380 : 0;
        translateY.setOffset(offset);
        translateY.setValue(0);  
      });
    }
  }

  return (
   <Container style={{
     opacity: translateY.interpolate({
       inputRange: [0, 150],
       outputRange: [0, 1],
     })
   }}>
    <Header />

    <Content>
      <Menu translateY={translateY} />
      <PanGestureHandler
        onGestureEvent={animatedEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Card style={{
          transform: [{
            translateY: translateY.interpolate({
              inputRange: [-350 , 0, 380],
              outputRange: [-50, 0, 380],
              extrapolate: 'clamp',
            }),
          }],
        }}>
          <CardHeader>
            <Icon name="attach-money" size={28} color="#666" />
            <Icon name="visibility-off" size={28} color="#666" />
          </CardHeader>
          <CardContent>
            <Title>Saldo disponível</Title>
            <Description>R$ 25.000,00</Description>
          </CardContent>
          <CardFooter>
            <Annotation>
              <Text>Transferência de R$ 200,00 recebida de Leiliboba hoja às 18:30</Text>
            </Annotation>
          </CardFooter>
        </Card>
      </PanGestureHandler>
    </Content>

     <Tabs translateY={translateY} />
   </Container>
  )
}