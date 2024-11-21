import React, { useState, useEffect, useContext } from 'react';
import { Alert, FlatList, StyleSheet, Text, View, Image} from 'react-native'
import { useIsFocused } from "@react-navigation/native";

import { ListItem, Avatar, Button, Icon} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Mongo_ListarItems } from '../../data/DatabaseFunctions'

import RemediosForm from './RemediosForm'
import RemediosHorarioForm from './RemediosHorarioForm'
import styleTheme from '../Theme'

import NoImage from '../../assets/images/noImage.png'
const No_Image = Image.resolveAssetSource(NoImage).uri;



const ListStack = createNativeStackNavigator();

 
function ListRemediosScreen() {
  return (
    <ListStack.Navigator>
      <ListStack.Screen name="ListRemedios" component={ListRemedios} options={{ title: 'Lista de Remédios' }} />
      <ListStack.Screen name="RemediosFormScreen" component={RemediosForm} options={{ title: 'Formulário Remédios' }} />
      <ListStack.Screen name="RemediosHorarioFormScreen" component={RemediosHorarioForm} options={{ title: 'Formulário Remédios' }} />
    </ListStack.Navigator>
  );
}



const ListRemedios = (props) => {

    const dark = false;
    const theme = styleTheme;
    const isFocused = useIsFocused();
    const [remove, setRemove] = useState();

    const [remedios, setRemedios] = useState([]); 
    const [refresh, setRefresh] = useState(0);

  
    useEffect(() => {

        const fetchRemedios = async () => {
          try {
              const remediosData = await Mongo_ListarItems('Remedios') // await Remedios();
              console.log("Remedios_USE_EFFECT:", remediosData);
              setRemedios(remediosData);
          } catch (error) {
              console.error("Erro ao obter Remedios:", error);
          }
      };

      fetchRemedios();
    }, [isFocused, remove])
 
    //console.log("Remedios:" + JSON.stringify(Remedios));
    
    function getRemedioItem({item: remedio}) {
        return (
           <> 
              <ListItem 
                key={remedio.id}
                bottomDivider
                onPress={()=> props.navigation.navigate('RemediosFormScreen', remedio)}
                style={[styles.listItem, theme.lLevel5]}
              >
        
                <Avatar rounded  source={{uri: remedio.foto_caixa ? remedio.foto_caixa : No_Image }} />
      
                <ListItem.Content style={styles.listContent}>
                  <ListItem.Title>{remedio.nome}</ListItem.Title>
                  <ListItem.Subtitle>Estoque: {remedio.qtd_guardado} {remedio.tipo_dose}</ListItem.Subtitle>
                  
                </ListItem.Content>
                {/* <Button
                    onPress={()=> props.navigation.navigate('AlunoForm', aluno)}
                    type="clear"
                    icon={<Icon name="edit" size={25} color="orange"/>}
                /> */}

              </ListItem>
         
           </>
   
        )
      }


    return(
      <>
        <View    style={[ styles.titulo , dark ? theme.dLevel1 : theme.lLevel10]} >
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Adicionar Remedios</Text>
            <Button
                style={{alignSelf: 'center'}}
                onPress={()=> props.navigation.navigate('RemediosFormScreen')}
                type="clear"
                icon={<FontAwesome name="plus-square" size={30} color='green' style={{marginLeft: 15}} />}
        />

        </View> 

        
        <FlatList
            keyExtractor={remedio => remedio._id.toString()}
            // data={state.cursos} state.hasOwnProperty("_j") ? state["_j"] :
            data={remedios}
            renderItem={getRemedioItem}
            style={dark ? theme.dLevel1 : theme.lLevel5} 
        />
      </>
    )
}

export default ListRemediosScreen



const styles= StyleSheet.create({
    titulo:{
        
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      textTitulo:{
        fontWeight: 'bold',
        fontSize: 20, 
        marginLeft: 10,
      },
      listItem:{
        marginTop: 5,
        
        
      },
      listContent:{
        borderRadius: 10
      }
    })