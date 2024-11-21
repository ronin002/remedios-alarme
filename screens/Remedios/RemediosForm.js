
import React, { useContext, useState, useEffect } from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, ScrollView, TextInput, StyleSheet, Alert, Image,Switch, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'react-native-elements';


import { Mongo_AddItem, Mongo_UpdateItem, Mongo_DeleteItem } from '../../data/DatabaseFunctions'
import styleTheme from '../Theme'
import RemediosHorarioForm from './RemediosHorarioForm'

import uuid from 'react-native-uuid';
import NoImage from '../../assets/images/noImage.png';
import NoImageCX from '../../assets/images/noImageCX.png';
import NoImageCMPRD from '../../assets/images/noImageCPRMD.png';


const No_Image = Image.resolveAssetSource(NoImage).uri;
const No_ImageCX = Image.resolveAssetSource(NoImageCX).uri;
const No_ImageCMPRD = Image.resolveAssetSource(NoImageCMPRD).uri;

export default ({route, navigation}) =>{

  const dark = false;
  const theme = styleTheme;

  //console.warn(route.params);
  const [isLoading, setIsLoading] = useState(false);
  const [remedio, setRemedio] = useState(route.params ? route.params: {})
  const [isNewRemedio, seIsNewRemedio] = useState(route.params ? false: true)
  const [hasRemedio, setHasRemedio] = useState(remedio.foto_caixa ? true: false);
  const [hasComprimido, setHasComprimido] = useState(remedio.foto_comprimido ? true: false);
  const [agendamento, setAgendamento] = useState(remedio.agendamento ? remedio.agendamento : []);
  //const {dispatch} = useContext( Context)

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageRemedio, setImageRemedio] = useState(remedio.foto_caixa ? remedio.foto_caixa : No_ImageCX);
  const [imageComprimido, setImageComprimido] = useState(remedio.foto_comprimido ? remedio.foto_comprimido : No_ImageCMPRD);
  
  function handleBack() {
    navigation.goBack();
  }

  console.log('agendamento:', agendamento)

  const handleImageCameraPicker = async (origem) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 50,
      maxHeight: 50

    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      quality:1,
    });
    if (!result.cancelled) {
      if (origem == "remedio"){
        setImageRemedio(result.assets[0].uri);
      }
      if (origem == "comprimido"){
        setImageComprimido(result.assets[0].uri);
      }
    }
  }


  const handleImagePicker = async (origem) => {
    const options = {
      mediaType: 'photo',
      maxWidth: 50,
      maxHeight: 50

    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      quality:1,
    });
    if (!result.cancelled) {
      if (origem == "remedio"){
        setImageRemedio(result.assets[0].uri);
      }
      if (origem == "comprimido"){
        setImageComprimido(result.assets[0].uri);
      }
    }
  }

  async function hadlePickFromGallery(origem) { 
    
    const options = {
      mediaType: 'photo',
      maxWidth: 50,
      maxHeight: 50

    } 
    console.log('Origem:' + origem);
    const result = await launchImageLibrary(options);
    console.log('Results:' + result);

    if (result.assets){

      if (origem == "remedio"){
        console.log('Gallery Origem REMEDIO');
        setImageRemedio(result.assets[0].uri);
        setHasRemedio(true);
      }
      if (origem == "comprimido"){
        setImageComprimido(result.assets[0].uri);
        setHasComprimido(true);
      }
    }
    //launchImageLibrary(options?, callback)
    
    //console.log("IMAGE URI:" + result);
  }



  function handleSelectOrigem(origem) {
    Alert.alert('Escolher origem da Imagem', 'Origem', [
      {
        text: 'Camera',
        onPress(){
          // dispatch({
          //   type: 'deleteremedio',
          //   payload: curso
          // })
          handleImageCameraPicker(origem);
        }
      },
      {
        text: 'Gallery',
        onPress(){
          //hadlePickFromGallery(origem);
          handleImagePicker(origem);
        }
      },
      {
        cancelable: true,
        onDismiss: () => { console.log ('Cancel Pressed')}
      }
    ])

  } 

  async function handlerDeleteRemedio() {
    Alert.alert('Remover remedio ', 'Exclusão', [
      {
        text: 'Sim',
        onPress(){
          Mongo_DeleteItem("Remedio",   remedio._id)
          Alert.alert('Remedio removido', 'Remedio removido com sucesso')
        }
      },
      {
        text: 'Não',
        onPress(){
          return;
        }
      },
      {
        cancelable: true,
        onDismiss: () => { console.log ('Cancel Pressed')}
      }
    ])
    
  }


  async function handlerNewRemedioRegister() {

    let now = new Date();
    let sNow = now.toISOString();
    
    let payload = {}
    //console.log('isNewremedio:' + isNewremedio)
    if (isNewRemedio == true){
      //console.log('NEW 1:')
      payload = {

            "_id":  uuid.v4(),
            "foto_caixa":  imageRemedio,
            "foto_comprimido": imageComprimido,
            "nome": remedio.nome,
            "paciente": remedio.paciente,
            "tratamento": remedio.tratamento,
            "qtd_guardado": remedio.qtd_guardado,
            "tipo_dose": remedio.tipo_dose,
            "agendamento":  remedio.agendamento,
            "created_at": sNow,
            "updated_at": ""
      }
      //console.log('NEW 2:' + payload)
      Mongo_AddItem("Remedios",  payload)
    }
    else{

      payload = {
            "foto_caixa":  imageRemedio,
            "foto_comprimido": imageComprimido,
            "nome": remedio.nome,
            "paciente": remedio.paciente,
            "tratamento": remedio.tratamento,
            "qtd_guardado": remedio.qtd_guardado,
            "tipo_dose": remedio.tipo_dose,
            "agendamento":  remedio.agendamento,
            "updated_at": sNow
          }
          //console.log('UPDATE 1:' + payload + " ID:" + remedio._id )
      Mongo_UpdateItem("Remedios", remedio._id, payload)
    }

    Alert.alert('Remedio salvo', 'Remedio salvo com sucesso')

  }



  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(status === 'granted');
      const { status2 } = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(status2 === 'granted');
    })();
  }, [])

  return (
    <>
      <ScrollView style={[style.form, dark ? theme.dLevel1 : theme.lLevel10]}>

        <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
          <TouchableOpacity 
              
              onPress={()=>{ handleSelectOrigem("remedio");}}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 25,  alignSelf: 'center'}}
                source={imageRemedio ? {uri: imageRemedio} : No_Image}
              />
          </TouchableOpacity>


          <TouchableOpacity 
              
              onPress={()=>{ handleSelectOrigem("comprimido");}}>
              <Image
                style={{ width: 100, height: 100, borderRadius: 25,  alignSelf: 'center'}}
                source={imageComprimido ? {uri: imageComprimido} : No_Image}
              />
          </TouchableOpacity>
          
        </View>

        <Text>Nome</Text>

        <TextInput
          style={style.input}
          onChangeText={nome => setRemedio({...remedio, nome})}
          placeholder="Informe o nome"
          value={remedio.nome}
        />

      <Text>Paciente:</Text>

      <TextInput
        style={style.input}
        onChangeText={paciente => setRemedio({...remedio, paciente})}
        placeholder="Informe o paciente"
        value={remedio.paciente}
      />

      <Text>Tratamento:</Text>

      <TextInput
        style={style.input}
        onChangeText={tratamento => setRemedio({...remedio, tratamento})}
        placeholder="Informe o tratamento"
        value={remedio.tratamento}
      />

      {/* <View style={style.casal}>
        <Text>Condutor:</Text>

        <Switch
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={true ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={(condutor) => setRemedio({...remedio, condutor})}
            value={remedio.condutor}
        />
      </View> */}

      <Text>Estoque atual:</Text>

      <TextInput
        style={style.input}
        onChangeText={qtd_guardado => setRemedio({...remedio, qtd_guardado})}
        placeholder="Informe a quantidade guardada"
        value={remedio.qtd_guardado}
      />
  
      <Text>Tipo dose:</Text>

      <TextInput
        style={style.input}
        onChangeText={tipo_dose => setRemedio({...remedio, tipo_dose})}
        placeholder="Informe o tipo de dose"
        value={remedio.tipo_dose}
      />


        <TouchableOpacity 
            style={style.diaSelecionado }
            onPress={()=> navigation.navigate('RemediosHorarioFormScreen', { screen: 'TESTE' , params: {remedio: remedio}})}>
            <Text style={style.dia_text} >Adicionar horário de tomar o remédio</Text>
        </TouchableOpacity>


      <Button title="Salvar"
        style={style.btnSave}
        onPress={()=>{

        handlerNewRemedioRegister();
      }}/>
      {isNewRemedio == false &&
        <TouchableOpacity
              style={style.btnDelete}
              onPress={()=>{ handlerDeleteRemedio();}}>
            <Text style={style.text_btn} >Excluir</Text>
        </TouchableOpacity>
      }
    </ScrollView>
  </>
  )
}


const style = StyleSheet.create({
  form: {
    padding: 12,
    height: '100%',
  }, 
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
    marginBottom: 15, padding: 10
  },
  casal:{
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 20,
    marginBottom: 10,
    marginTop: 10,
  },
  btnDelete :{
    backgroundColor: 'red',
    height: 40,
    borderRadius: 5,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_btn: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  diaSelecionado:{
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    width: '80%',
    height: 40,
    backgroundColor: '#faac52',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dia_text: {
    color: '#575551',
    fontWeight: 'bold',
  },
  viewHorarios: {
    borderRadius: 10,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,

  },
  btnSave:{

    padding: 10,
    marginTop: 15,

  }
})
