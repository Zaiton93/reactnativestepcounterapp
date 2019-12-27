import React, { Component } from 'react';
import { Pedometer } from 'expo-sensors';
import { View, Text, TouchableHighlight, Image, Platform, SafeAreaView, TextInput, Alert, Button} from 'react-native';
import { DrawerNavigator } from 'react-navigation'; 
import Icon from 'react-native-vector-icons/Feather';
import CircularProgress from './circularprogress';
import CountDown from 'react-native-countdown-component';
import moment from 'moment';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Card } from 'react-native-paper';
import RNSpeedometer from 'react-native-speedometer';
import { DataTable } from 'react-native-paper';

class HeaderNavigationBar extends Component {
    render() {
        return (<View style={{
            height: 70,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center'
        }}>
            <TouchableHighlight style={{ marginLeft: 10, marginTop: 15 }}
                onPress={() => { this.props.navigation.openDrawer() }}>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={{uri: 'https://pngimage.net/wp-content/uploads/2018/06/hamburger-menu-icon-png-white-4.png'}}
                />
            </TouchableHighlight>
        </View>);
    }
}

export class HomeScreen extends Component {
  state = {
    isPedometerAvailable: "checking",
    pastStepCount: 0,
     totalDuration: '',
  };
  
  componentDidMount() {
    this._subscribe();

       var date = moment()
      .utcOffset('+08:00')
      .format('YYYY-MM-DD hh:mm:ss');
    //Getting the current date-time with required formate and UTC   
    
    var expirydate = '2019-12-28 06:50:30';//You can set your own date-time
    //Let suppose we have to show the countdown for above date-time 

    var diffr = moment.duration(moment(expirydate).diff(moment(date)));
    //difference of the expiry date-time given and current date-time

    var hours = parseInt(diffr.asHours());
    var minutes = parseInt(diffr.minutes());
    var seconds = parseInt(diffr.seconds());
    
    var d = hours * 60 * 60 + minutes * 60 + seconds;
    //converting in seconds

    this.setState({ totalDuration: d });
    //Settign up the duration of countdown in seconds to re-render
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps
      });
    });
    
   
    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result)
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: "Could not get isPedometerAvailable: " + error
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: "Could not get stepCount: " + error
        });
      }
    );
  };
  
  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

    render() {
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'teal',
             marginTop: 10

        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'teal',
                alignItems: 'center'
            }}>
            
            <CircularProgress progress={this.state.currentStepCount} />
             <Image source={require('./running.png')} style={{width:'33%', height:'29%', position: 'absolute', marginTop: 110, alignItems: 'center'}} />
              <Text style={{ fontSize: 80, fontFamily: 'Feather', color: 'white' }}>
          {this.state.currentStepCount}
        </Text>
        <Text style={{ fontSize: 20, fontFamily: 'Feather', color: 'white' }}>
          {' '}
          Walk as fast as you can Champ!{' '}
        </Text>

        <CountDown
          style={{marginTop:50}}
          
          until={this.state.totalDuration}
          //duration of countdown in seconds
          timetoShow={('M', 'S')}
          //formate to show
          onFinish={() => alert('finished')}
          //on Finish call
          onPress={() => alert('hello')}
          //on Press call
          size={20}
        />
                
            </View>
        </View>);
    }
}

export class SpeedScreen extends Component {
  state = {
    value: 0,
    location: null,
    errorMessage: null,
  };
componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let value = await Location.speed();
    this.setState(value);

  
  };
  props = {
  defaultValue: 50,
  minValue: 0,
  maxValue: 100,
  easeDuration: 500,
  labels: [
    {
      name: 'Too Slow',
      labelColor: '#000',
      activeBarColor: '#000',
    },
    {
      name: 'Very Slow',
      labelColor: '#ff5400',
      activeBarColor: '#ff5400',
    },
    {
      name: 'Slow',
      labelColor: '#f4ab44',
      activeBarColor: '#f4ab44',
    },
    {
      name: 'Normal',
      labelColor: '#f2cf1f',
      activeBarColor: '#f2cf1f',
    },
    {
      name: 'Fast',
      labelColor: '#14eb6e',
      activeBarColor: '#14eb6e',
    },
    {
      name: 'Unbelievably Fast',
      labelColor: '#00ff6b',
      activeBarColor: '#00ff6b',
    },
  ],
  };
 
  onChange = (value) => this.setState({ value: parseInt(value) });

    render() {
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'teal',
             marginTop: 10
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'teal',
                alignItems: 'center',
                textInput: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    height: 25,
    fontSize: 20,
    marginVertical: 50,
    marginHorizontal: 20,
  },
            }}>
                <Text style={{ fontWeight: 'bold', fontSize: 30, marginTop: 20, color: 'white', fontFamily:'Feather'}}>
                    Let's Test Your Speed!
                </Text>

                <Text style={{marginTop: 100}}></Text>
                <SafeAreaView>
                <TextInput placeholder="Speedometer Value" onChangeText={this.onChange} />
          <RNSpeedometer value={this.state.value} size={300}/>
        </SafeAreaView>
            </View>
        </View>);
    }

}

export class CalorieScreen extends Component {

    render() {
        return (<View style={{
             flex: 1,
            flexDirection: 'column',
            backgroundColor: 'teal',
             marginTop: 10
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
               flex: 1,
                backgroundColor: 'white',
                alignItems: 'center'
            }}>
               <DataTable>
        <DataTable.Header>
          <DataTable.Title>steps</DataTable.Title>
          <DataTable.Title numeric>Calories Burned</DataTable.Title>
      
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>100</DataTable.Cell>
          <DataTable.Cell numeric>50</DataTable.Cell>
          
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>500</DataTable.Cell>
          <DataTable.Cell numeric>200</DataTable.Cell>
        </DataTable.Row>

     <DataTable.Row>
          <DataTable.Cell>1000</DataTable.Cell>
          <DataTable.Cell numeric>400</DataTable.Cell>
        </DataTable.Row>

             <DataTable.Row>
          <DataTable.Cell>1500</DataTable.Cell>
          <DataTable.Cell numeric>600</DataTable.Cell>
        </DataTable.Row>

             <DataTable.Row>
          <DataTable.Cell>2000</DataTable.Cell>
          <DataTable.Cell numeric>800</DataTable.Cell>
        </DataTable.Row>

             <DataTable.Row>
          <DataTable.Cell>2500</DataTable.Cell>
          <DataTable.Cell numeric>1000</DataTable.Cell>
        </DataTable.Row>
        <DataTable.Pagination
          page={1}
          numberOfPages={1}
          onPageChange={(page) => { console.log(page); }}
          label="1 of 1"
        />
      </DataTable>
                
            </View>
        </View>);
    }

}
export class NutritionScreen extends Component {

    render() {
        return (<View style={{
             flex: 1,
            flexDirection: 'column',
            backgroundColor: 'teal',
             marginTop: 10,
        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
               flex: 1,
                backgroundColor: 'white',
                alignItems: 'center'
            }}>
                
                <DataTable>
        <DataTable.Header>
          <DataTable.Title>Dessert</DataTable.Title>
          <DataTable.Title numeric>Calories</DataTable.Title>
          <DataTable.Title numeric>Fat</DataTable.Title>
        </DataTable.Header>

        <DataTable.Row>
          <DataTable.Cell>Frozen yogurt</DataTable.Cell>
          <DataTable.Cell numeric>159</DataTable.Cell>
          <DataTable.Cell numeric>6.0</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Row>
          <DataTable.Cell>Ice beans </DataTable.Cell>
          <DataTable.Cell numeric>337</DataTable.Cell>
          <DataTable.Cell numeric>1.0</DataTable.Cell>
        </DataTable.Row>
         <DataTable.Row>
          <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
          <DataTable.Cell numeric>237</DataTable.Cell>
          <DataTable.Cell numeric>8.0</DataTable.Cell>
        </DataTable.Row>
         <DataTable.Row>
          <DataTable.Cell> Almonds</DataTable.Cell>
          <DataTable.Cell numeric>575</DataTable.Cell>
          <DataTable.Cell numeric>49.0</DataTable.Cell>
        </DataTable.Row>
         <DataTable.Row>
          <DataTable.Cell> Walmuts </DataTable.Cell>
          <DataTable.Cell numeric>654</DataTable.Cell>
          <DataTable.Cell numeric>65.0</DataTable.Cell>
        </DataTable.Row>
         <DataTable.Row>
          <DataTable.Cell>Avocado</DataTable.Cell>
          <DataTable.Cell numeric>160</DataTable.Cell>
          <DataTable.Cell numeric>15.0</DataTable.Cell>
        </DataTable.Row>
         <DataTable.Row>
          <DataTable.Cell>Bananas</DataTable.Cell>
          <DataTable.Cell numeric> 89</DataTable.Cell>
          <DataTable.Cell numeric>0.0</DataTable.Cell>
        </DataTable.Row>

        <DataTable.Pagination
          page={1}
          numberOfPages={1}
          onPageChange={(page) => { console.log(page); }}
          label="1 of 1"
        />
      </DataTable>
                
            </View>
        </View>);
    }

}

export class BMIScreen extends Component {
constructor(){
  super();
  this.state={
    height:0,
    weight:0,
    BMI:0
  };
}

calculateBMI(){
  this.setState({BMI:(this.state.weight/Math.pow(this.state.height,2)).toFixed(2)},() => {

  if(this.state.BMI>30.0){
    Alert.alert('Obese');
  }
  else if(this.state.BMI>24.90 && this.state.BMI<30.00){
    Alert.alert('Overweight');
  }
  else if(this.state.BMI>=18.50 && this.state.BMI<=24.90){
    Alert.alert('Normal');
  }
  else if(this.state.BMI<18.50){
    Alert.alert('Underweight');
  }
});
}
   render() {
        return (<View style={{
            flex: 1,
            flexDirection: 'column',
            backgroundColor: 'teal',
             marginTop: 10

        }}> 
        <HeaderNavigationBar {...this.props} />
            <View style={{
                flex: 1,
                backgroundColor: 'teal',
                alignItems: 'center'
            }}>
            <Image source={{uri: 'https://img1.androidappsapk.co/QNv6xdGxH4cxo599rdgdnsqALrDU9RqZsp54R0y99AuQ6JYQnqsJpivXoe6NQlKGng=s300'}} style={{width:200, height:200, alignItems: 'center', marginTop: 80}} /> 
             <Text style={{marginTop: 30}}></Text>
        
      <TextInput onChangeText={(height)=>this.setState({height})} placeholder=" Key In Height (in meter)"/>
      <TextInput onChangeText={(weight)=>this.setState({weight})} placeholder=" Key In Weight (in kilograms)"/>

      <Text style={{fontWeight: 'bold', fontSize: 30, marginTop: 20, marginBottom: 20, color: 'white', fontFamily:'Feather'}}>{this.state.BMI}</Text>

      <Button onPress={() =>this.calculateBMI()} title="Calculate BMI"></Button>
        
    
        </View>
        </View>);
    }

}


export default DrawerNavigator (
    {
      Home:{
        screen:HomeScreen
      },
       SpeedCounter:{
        screen:SpeedScreen
      },
      CalorieCounter:{
        screen:CalorieScreen
      },
       Nutrition:{
        screen:NutritionScreen
      },
      BMICalc:{
        screen:BMIScreen
      }
    },{
        initialRouteName:'Home'
    }
)

