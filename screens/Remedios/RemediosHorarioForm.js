
import React, { useContext, useState, useEffect } from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//import * as ImagePicker from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import { Text, View, ScrollView, TextInput, StyleSheet, Alert, Image,Switch, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'react-native-elements';

import  RNDateTimePicker  from '@react-native-community/datetimepicker';

import { Mongo_AddItem, Mongo_UpdateItem, Mongo_DeleteItem } from '../../data/DatabaseFunctions'
import styleTheme from '../Theme'

import uuid from 'react-native-uuid';

export default (props) =>{

  const dark = false;
  const theme = styleTheme;

  const remedio = props.route.params ? props.route.params.params.remedio : {};
 

  let defaultAgendamento = {
    "uso_continuo": false,
    "data_inicio": "",
    "data_termino": "",
    "qtd_dose": 1,
    "horarios":  [],
    "created_at": "",
    "updated_at": ""
}

  //console.warn(route.params);
  const [isLoading, setIsLoading] = useState(false);
  const [agendamento, setAgendamento] = useState(remedio.agendamento?.data_inicio ? remedio.agendamento: defaultAgendamento)
  const [isNewAgendamento, seIsNewAgendamento] = useState(agendamento.data_inicio ? false: true);
  const [horarios, setHorarios] = useState(remedio.agendamento?.horarios ? remedio.agendamento.horarios : []);
  const [showTime, setShowTime] = useState(false);
  const [time, setTime] = useState(false);

  const [showData, setShowData] = useState(false);
  const [data, setData] = useState(false);
  const [dataInicio, setDataInicio] = useState(false);
  const [editHorario, setEditHorario] = useState(false);



  //const [horarios, setHorarios] = useState(remedio.agendamentos?.horarios ? remedio.agendamentos.horarios : []);
  console.log('agendamento:', JSON.stringify(agendamento));
  function handleBack() {
    navigation.goBack();
  }

  function onHoraSelected(event,time){

        
    setShowTime(false);
    let minutes = time.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    let hora = time.getHours();
    if (hora < 10) {
      hora = "0" + hora;
    }


    if(editHorario){
      setAgendamento({...agendamento, horarios: agendamento.horarios.map(h => h === editHorario ? hora + ":" + minutes : h)})
    }
    else {
      setAgendamento({...agendamento, horarios: [...agendamento.horarios, hora + ":" + minutes]})
    }
    setEditHorario(false);
    //setHorarios([...horarios, time.getHours() + ":" + time.getMinutes()])
    
  }

  function onDataSelected(event,time){

        
    setShowData(false);

    if (dataInicio){
      setAgendamento({...agendamento, data_inicio: time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear()})
    }
    else{
      setAgendamento({...agendamento, data_termino: time.getDate() + "/" + (time.getMonth() + 1) + "/" + time.getFullYear()})
    }
    setDataInicio(false);
    //setHorarios([...horarios, time.getHours() + ":" + time.getMinutes()])
    
  }



  function  handleDataInicio() {
    setDataInicio(true);
    setShowData(true);
  }

  function handleEditHorario(horario) {
    setEditHorario(horario);
    setShowTime(true);
  }
  
  function handleRemoveHorario(horario) {
    Alert.alert('Remover horário de remedio ', 'Exclusão', [
      {
        text: 'Sim',
        onPress(){
          setAgendamento({...agendamento, horarios: agendamento.horarios.filter(h => h !== horario)})
        }
      },
      {
        text: 'Não',
        onPress(){
          return;
        }
      }
    ])
    
  }

  async function handlerDeleteHorarioRemedio() {
    Alert.alert('Remover horário de remedio ', 'Exclusão', [
      {
        text: 'Sim',
        onPress(){
          Mongo_DeleteItem("Remedio",   remedio._id)
          Alert.alert('Horário de remedio removido', 'Horário remedio removido com sucesso')
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


  async function handlerNewHorarioRegister() {

    let now = new Date();
    let sNow = now.toISOString();
    
    let payload = {}
    //console.log('isNewremedio:' + isNewremedio)
    if (isNewAgendamento == true){
      //console.log('NEW 1:')
      payload = {
            "_id":  uuid.v4(),
            "_idRemedio":  agendamento._idRemedio,
            "uso_continuo": agendamento.uso_continuo,
            "data_inicio": agendamento.data_inicio,
            "data_termino": agendamento.data_termino,
            "qtd_dose": agendamento.qtd_dose,
            "horarios": agendamento.horarios,
            "created_at": sNow,
            "updated_at": ""
      }
      //console.log('NEW 2:' + payload)
      Mongo_AddItem("Remedios",  payload)
    }
    else{

      payload = {
            "uso_continuo": agendamento.uso_continuo,
            "data_inicio": agendamento.data_inicio,
            "data_termino": agendamento.data_termino,
            "qtd_dose": agendamento.qtd_dose,
            "horarios": agendamento.horarios,
            "updated_at": sNow
          }
          //console.log('UPDATE 1:' + payload + " ID:" + remedio._id )
      Mongo_UpdateItem("Remedios", agendamento._id, payload)
    }

    Alert.alert('Agendamento de remédio salvo', 'Agendamento remédio salvo com sucesso')

  }



  return (
    <>
      <ScrollView style={[style.form, dark ? theme.dLevel1 : theme.lLevel10]}>


        <View style={style.casal}>
          <Text>Remédio de uso contínuo ou uso por tempo indeterminado?</Text>

          <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={true ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(uso_continuo) => setAgendamento({...agendamento, uso_continuo})}
              value={agendamento.uso_continuo}
          />
        </View>
      
        <TouchableOpacity 
            style={[style.data_touch, agendamento.uso_continuo ? style.uso_continuo_true : style.uso_continuo_false]}
            onPress={()=> handleDataInicio()}>
            <Text style={style.dia_text} >Data inicio: {agendamento.data_inicio}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[style.data_touch, agendamento.uso_continuo ? style.uso_continuo_true : style.uso_continuo_false]}
            onPress={()=> setShowData(true)}>
            <Text style={style.dia_text} >Data término: {agendamento.data_termino}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[style.data_touch, style.btn_horarios]}
            onPress={()=> setShowTime(true)}>
            <Text style={style.dia_text} >Adicionar Horários</Text>
        </TouchableOpacity>

        {showData && (
            <RNDateTimePicker
              value={new Date()}
              mode={'date'}
              // display={Platform.0S === ‘ios' ? 'spinner' : ‘default'}
              onChange={onDataSelected}
            />
          )
        }

        { showTime && (
            <RNDateTimePicker
              value={new Date()}
              mode={'time'}
              // display={Platform.0S === ‘ios' ? 'spinner' : ‘default'}
              is24Hour={false}
              onChange={onHoraSelected}
              
            />
          )
         }

        {agendamento.horarios &&
          agendamento.horarios.map((horario, index) => {
            return (
              <View key={index} style={[style.viewHorarios,theme.lLevel3]}>
                <Text>Horário: {horario}</Text>
                <TouchableOpacity 
                    style={style}
                    onPress={()=> handleEditHorario(horario)}>
                    <Icon name="edit" size={25} color='orange'/>
                </TouchableOpacity>


                <TouchableOpacity 
                    style={style}
                    onPress={()=> handleRemoveHorario(horario)}>
                    <Icon name="cancel" size={25} color='red'/>
                </TouchableOpacity>
              </View>
            )
          })
        }

      <Button title="Salvar"
        style={style.btnSave}
        onPress={()=>{

        handlerNewAgendamentoRegister();
      }}/>
      {isNewAgendamento == false &&
        <TouchableOpacity
              style={style.btnDelete}
              onPress={()=>{ handlerDeleteAgendamento();}}>
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
    margin: 10,
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
  data_touch:{
    marginBottom: 10,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    width: '80%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uso_continuo_true:{
    backgroundColor: '#9e9d9d',
  },
  uso_continuo_false:{
    backgroundColor: '#faac52',
  },
  btn_horarios:{
    backgroundColor: '#1be382',
  },


  viewHorarios: {
    borderRadius: 10,
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,

  },
  btnSave:{
    padding: 10,
    marginTop: 15,
  }
})
