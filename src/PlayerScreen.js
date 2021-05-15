import React, { useRef, useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";

import TrackPlayer, {Capability, Event} from 'react-native-track-player';
import songs from "./data.json";
import Controller from "./Controller";
import SliderComp from "./SliderComp";

const { width, height } = Dimensions.get("window");

export default function PlayerScreen() {
  const scrollX = useRef(new Animated.Value(0)).current;

  const slider = useRef(null);
  const [songIndex, setSongIndex] = useState(0);
  const isPlayerReady= useRef(false)
  // for tranlating the album art
  const position = useRef(Animated.divide(scrollX, width)).current;

  useEffect(() => {
    scrollX.addListener(({ value }) => {
      const val = Math.round(value / width);

      setSongIndex(val);

    });

    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, (e)=>{
      console.log(e);
    })
    TrackPlayer.setupPlayer().then(async() => {
      // The player is ready to be used
      console.log('Player Ready');
      await TrackPlayer.reset()
      await TrackPlayer.add(songs)
      isPlayerReady.current = true;
      TrackPlayer.play()

      await TrackPlayer.updateOptions({
        stopWithApp:false,
        alwaysPauseOnInterruption:true,
        capabilities:[
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious
        ],
      })
  });

    return () => {
      scrollX.removeAllListeners();
    };

    
  }, []);

  useEffect(() => {
    if(isPlayerReady.current){
      TrackPlayer.skip(songs[songIndex].id)
    }
  }, [songIndex])

  const goNext = () => {
    slider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };
  const goPrv = () => {
    slider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderItem = ({ index, item }) => {
    return (
      <Animated.View
        style={{
          alignItems: "center",
          width: width,
          transform: [
            {
              translateX: Animated.multiply(
                Animated.add(position, -index),
                -100
              ),
            },
          ],
        }}
      >
        <Animated.Image
          source={{uri: item.artwork}}
          style={{ width: 320, height: 320, borderRadius: 5 }}
        />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
     
      <SafeAreaView style={{ height: 320 }}>
        <Animated.FlatList
          ref={slider}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={songs}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: true }
          )}
        />
      </SafeAreaView>
      <View>
        <Text style={styles.title}>{songs[songIndex].title}</Text>
        <Text style={styles.artist}>{songs[songIndex].artist}</Text>
      </View>
      <SliderComp/>
      <Controller onNext={goNext} onPrv={goPrv} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    textAlign: "center",
    textTransform: "capitalize",
    color:'white',
    marginTop:20,
    
  },
  artist: {
    fontSize: 18,
    textAlign: "center",
    textTransform: "capitalize",
    color:'white',
    marginBottom:20
  },
  container: {
    justifyContent: "space-evenly",
    height: height,
    maxHeight: 500,
  },
});