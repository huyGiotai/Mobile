
import { Image, Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {Marquee} from '@animatereactnative/marquee'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';

export default function Landing() {
    const imageList = [

        require('../../assets/images/1.jpg'),
        require('../../assets/images/2.jpg'),
        require('../../assets/images/3.jpg'),
        require('../../assets/images/4.jpeg'),
        require('../../assets/images/5.jpg'),
        require('../../assets/images/6.jpg'),
        require('../../assets/images/7.jpg'),
        require('../../assets/images/8.jpg'),
        require('../../assets/images/9.jpg'),
        require('../../assets/images/10.jpg'),
    ]
    const router = useRouter();
    return (
    <GestureHandlerRootView>
      <View>
        <Marquee spacing={10} speed={0.7}
            style={{
                transform: [{ rotate: '-4deg'}]
            }}
        >
            <View style = {styles.imageContainer}> 
                {imageList.map((image, index)=>(
                 <Image key={index} source={image} 
                        style = {styles.iamge}
                    />
                ))}
            </View>
        </Marquee>

        <Marquee spacing={10} speed={0.4}
            style={{
                transform: [{ rotate: '-4deg'}],
                marginTop: 10
            }}
        >
            <View style = {styles.imageContainer}> 
                {imageList.map((image, index)=>(
                 <Image key={index} source={image} 
                        style = {styles.iamge}
                    />
                ))}
            </View>
        </Marquee>

        <Marquee spacing={10} speed={0.5}
            style={{
                transform: [{ rotate: '-4deg'}],
                marginTop: 10
            }}
        >
            <View style = {styles.imageContainer}> 
                {imageList.map((image, index)=>(
                 <Image 
                        key={index} 
                        source={image} 
                        style = {styles.iamge}
                    />
                ))}
            </View>
        </Marquee>
      </View>

      <View style={{
            height: '100%',
            padding: 20
      }}>
        <Marquee spacing={300} speed={1.5}
            >
        <Text style={{
            fontFamily: 'outfit-bold',
            fontSize: 25,
            textAlign: 'center',
            marginTop: 30
        }}>
        🎬 Chào mừng đến với HuyFlix.    🔍 Khám phá thông tin phim, xem trailer, đánh giá và nhiều hơn nữa.     📽️ Sẵn sàng bước vào thế giới điện ảnh? 🚀
        </Text>
        </Marquee>

        <TouchableOpacity style={styles.button}
        onPress={() => router.push('/')}>
            <Text style={{
                textAlign: 'center',
                color: '#fff',
                fontSize: 17,
                fontFamily: 'outfit'
            }}>Get Started</Text>
        </TouchableOpacity>

      </View>
      </GestureHandlerRootView>
    )
  }

  const styles = StyleSheet.create({
    iamge: {
        width: 160,
        height: 160,
        borderRadius: 25
    },

    imageContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 15
    },

    button: {
        backgroundColor: '#299446',
        padding: 15,
        borderRadius: 15,
        marginTop: 20
    }

  })
  



