import { StyleSheet, Alert, Text, TouchableOpacity, View, Image } from "react-native";
import styleTheme from './Theme'


import ImgRemedios from '../assets/images/remedios.png'
import ImgAlarme from '../assets/images/relogio_remedios.png'


const Img_Remedios = Image.resolveAssetSource(ImgRemedios).uri;
const Img_Alarme = Image.resolveAssetSource(ImgAlarme).uri;


export default function Menu({ navigation }) {

  const dark = false;
  const theme = styleTheme;

  function handleAlarmes() {
    Alert.alert('Feature em desenvolvimento ', 'Desculpe', [
      {
        cancelable: true,
        onDismiss: () => { console.log ('Cancel Pressed')}
      }
    ])
    
  }
  return (
    <View style={[styles.container, theme.lLevel10 ]}>

        <TouchableOpacity
          style={[styles.menuCard, theme.lLevel5]}
          onPress={()=> navigation.navigate('ListRemedios')}>
          <Image source={{uri: Img_Remedios}} style={{width: 100, height: 100}}/>
          <Text style={styles.textCard}>Remédios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, theme.lLevel5]}
          onPress={()=> handleAlarmes()}>
          
          <Image source={{uri: Img_Alarme}} style={{width: 80, height: 100}}/>
          <Text style={styles.textCard}>Alarmes</Text>
        </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  menuCard:{
    borderRadius: 10,
    width: '40%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCard: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
