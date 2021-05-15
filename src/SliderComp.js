import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import TrackPlayer, {useProgress} from 'react-native-track-player'
import Slider from '@react-native-community/slider';

const formatTime=(secs)=>{
    let minutes =Math.floor(secs/60);
    let seconds =Math.ceil(secs-minutes*60);

    if (seconds<10) seconds=`0${seconds}`;

    return `${minutes}:${seconds}`;
}

export default function SliderComp() {

    const {position,duration} = useProgress();

    const handleChange=(val)=>{
        TrackPlayer.seekTo(val)
    }
  
    return (
        <View style={styles.container}>
             <Slider
                style={{width: "90%", height: 40 , marginHorizontal:20}}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor='violet'
                thumbTintColor='#666666'
                onSlidingComplete={handleChange}
            />

            <View style={styles.timerContainer}>
                <Text style={styles.timer}>
                {formatTime(position)}
                </Text>
                <Text style={styles.timer}>
                {formatTime(duration)}
                </Text>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        height:70
    },
    timerContainer:{
        flexDirection:'row',
        justifyContent: 'space-between',

    },
    timer:{
        color:'#fff',
        fontSize:16,
        marginHorizontal:25
    },

})
