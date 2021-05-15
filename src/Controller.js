import React,{useEffect, useRef, useState} from "react";
import { View, TouchableOpacity, StyleSheet, Switch, ActivityIndicator } from "react-native";
import Icon  from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

export default function Controller({ onNext, onPrv }) {

    const playbackState = usePlaybackState();
    const [isPlaying,setisPlaying] = useState("paused")

    useEffect(() => {
    
      if (playbackState===3 || playbackState==="playing"){
        setisPlaying("playing")
        }
        else if (playbackState===2 || playbackState==="paused" )
        {
            setisPlaying( "paused")

        }
        else{
            setisPlaying("loading")
        }
    }, [playbackState])

    const renderPlayPauseBtn=()=>{
        switch (isPlaying) {
            case "playing":
                return <Icon name="pause" size={45} color={'white'}/>
            
            case "paused":
                return <Icon name="play-arrow" size={45} color={'white'}/>

            default:
                return <ActivityIndicator size={45} color={'white'} />
        }
    }

    const onPlayPause=()=>{

        console.log(playbackState);
        if (playbackState===3 || playbackState==="playing"){
            TrackPlayer.pause()
        }
        else if (playbackState===2 || playbackState==="paused" )
        {
            TrackPlayer.play()
        }
    }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPrv}>
        <Icon name="skip-previous" size={45} color={'white'}/>
      </TouchableOpacity>

      <TouchableOpacity
      onPress={
        onPlayPause
        // TrackPlayer.pause()
      }
      >
       {renderPlayPauseBtn()}
      </TouchableOpacity>

      <TouchableOpacity onPress={onNext}>
        <Icon name="skip-next" size={45} color={'white'}/>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});