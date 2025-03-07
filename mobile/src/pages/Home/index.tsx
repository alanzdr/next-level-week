import React, { useState } from 'react'
import { 
  View, 
  ImageBackground, 
  Image, 
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { Feather as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";

import { styles } from './styles'

const Home = () => {
  const [uf, setUf] = useState('')
  const [city, setCity] = useState('')

  const navigation = useNavigation();

  const handleNavigateToPoints = () => {
    navigation.navigate('Points', {
      uf,
      city
    })
  }

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : undefined}
    >
      <ImageBackground 
        style={styles.container} 
        source={require('../../assets/home-background.png')}
        imageStyle={{width: 274, height: 368}}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marktplace de coleta de resíduos</Text>
            <Text style={styles.description}>Ajudamos pessoas a encotrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput 
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            onChangeText={setUf}
            autoCapitalize="characters"
            maxLength={2}
            autoCorrect={false}
          />
          <TextInput 
            style={styles.input}
            placeholder="Digite a Cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Icon name="arrow-right" color="#fff" size={24} />
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  )
}

export default Home
