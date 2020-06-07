import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native'
import { Feather as Icon, FontAwesome } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { RectButton } from "react-native-gesture-handler";
import * as MailComposer from 'expo-mail-composer';

import api from '../../services/api'
import { styles } from './styles'

interface Params {
  point_id: number
}

interface Data {
  point: {
    image: string,
    image_url: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string
  }
  items: {
    title: string
  }[]
}

const Detail = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<Data>()
  const route = useRoute()

  const routeParams = route.params as Params;

  useEffect(() => {
    api
      .get(`points/${routeParams.point_id}`)
      .then(response => {
        setData(response.data)
      })
  }, [routeParams.point_id])

  const handleNavigateBack = () => {
    navigation.goBack();
  }

  
  if (!data) return null;

  const handleComposeEmail = () => {
    MailComposer.composeAsync({
      subject: 'Interesse na coleta de residuos',
      recipients: [data?.point.email]
    })
  }

  const handleWhatsapp = () => {
    Linking.openURL(`whataspp://send?phone=${data.point.whatsapp}&text=Tenho interesse na coleta de residuos`)
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image 
          style={styles.pointImage}
          source={{uri: data.point.image_url}}
        />

        <Text style={styles.pointName}>{data.point.name}</Text>
        <Text style={styles.pointItems}>
          {data.items.map(item => item.title).join(',')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.point.city}, {data.point.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name='whatsapp' size={20} color="#fff" />
          <Text style={styles.buttonText}>Whatsapp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeEmail}>
          <Icon name='mail' size={20} color="#fff" />
          <Text style={styles.buttonText}>Email</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  )
}

export default Detail
