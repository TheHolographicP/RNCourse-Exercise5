import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';


import Colors from 'constants/colors';


export default function App() {
  return (
    <View style={styles.rootScreen}>
      <Text>App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rootScreen:{
    flex:1,
  },

});
