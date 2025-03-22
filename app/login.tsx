import Colors from '@/constants/Colors'
import { defaultStyles } from '@/constants/Styles'
import { useAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Image, TextInput, TouchableOpacity, Alert, Modal } from 'react-native'


const Page = () => {
  const {type} = useLocalSearchParams<{type:string}>()
  console.log('type', type);


  const [emailAddress, setEmailAdress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const [code, setCode] = useState(''); 
  const [modalVisible, setModalVisible] = useState(false);
  console.log('email address', emailAddress);
  
  console.log('password', password);
  

  const {signIn, isLoaded, setActive} = useSignIn()
  
  //* give them different names with ts buy putting them after ":"
  const {signUp, isLoaded: signUpLoaded, setActive: signupSetActive} = useSignUp()
  console.log('signUpLoaded', signUpLoaded);


//! only to check if I'm signed in
const { isSignedIn, userId } = useAuth();
console.log('User Signed In:', isSignedIn);
console.log('User ID:', userId);



//* handles user sign-up by creating an account with an email and password, setting the session if successful, logging errors if they occur, displaying an alert for the first error message, and managing a loading state throughout the process.
  const onSignUpPress = async() => {
    if(!signUpLoaded) return;
    setLoading(true)

    try{
      // const result = await signUp.create({emailAddress, password})
      // console.log(' onSignUpPress ~result:', result);
      await signUp.create({emailAddress, password})

      await signUp.prepareEmailAddressVerification({strategy: 'email_code'})
      
      Alert.alert('Verification code sent', 'Check your email for the code.');
      setModalVisible(true);
      // signupSetActive({
      //   session: result.createdSessionId
      // })
    } catch (error: any) {
      console.log('onSignUpPress ~error:', error);
      Alert.alert(error.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  // to force a signOut
// const { signOut } = useAuth();
  
//   const onSignOutPress = async () => {
//     try {
//       await signOut();
//       console.log("User signed out successfully.");
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };
//   onSignOutPress()


  const onVerifyCodePress = async () => {
    console.log('working');
    
    if(!signUpLoaded) return;
    setLoading(true)

    try {
      await signUp.attemptEmailAddressVerification({ code });
  
      const result = await signUp.create({});
      await signupSetActive({
         session: result.createdSessionId 
        });
  
      Alert.alert('Success!', 'Account created and logged in.');
    } catch (error: any) {
      console.log('Verification error:', error);
      Alert.alert(error.errors[0].message);
    }
  };





  const onSignInPress = async() => {
    if(!isLoaded) return;
    setLoading(true)

    try{
      const result = await signIn.create({identifier: emailAddress, password})
      console.log(' onSignInPress ~result:', result);

      setActive({
        session: result.createdSessionId
      })
    } catch (error: any) {
      console.log('onSignInPress ~error:', error);
      Alert.alert(error.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

 //* This is just for me so that I can force a logout
  // const { signOut } = useAuth();
  
  // const onSignOutPress = async () => {
  //   try {
  //     await signOut();
  //     console.log("User signed out successfully.");
  //   } catch (error) {
  //     console.error("Error signing out:", error);
  //   }
  // };
  // onSignOutPress()
  
  return (
    // research how to fix KeyboardAvoidingView so that it doesn't cover my important things on the page
    <KeyboardAvoidingView 
      behavior={Platform.OS == 'ios'? 'padding' : 'height'}
      keyboardVerticalOffset={70} 
      style={styles.container} >
      {loading && (
      <View style={defaultStyles.loadingOverlay}>
        {/* this is the loading sign */}
           <ActivityIndicator size='large' color='#fff' />
        </View>
        )} 
        <Image source={require('../assets/images/logo-dark.png')} style={styles.logo} />

      <Text style={styles.title}>
        {type === 'login' ? 'Welcome back' : 'Create your account'}
      </Text>

      <View style={{ marginBottom:30 }}>
        <TextInput         
          autoCapitalize='none' 
          placeholder='Email'
          value={emailAddress} 
          onChangeText={setEmailAdress}
          style={styles.inputField} 
         />
        <TextInput 
          placeholder='Password'
          value={password} 
          onChangeText={setPassword}
          secureTextEntry
          style={styles.inputField}
         />
      </View>

    {type === 'login'? (
      <TouchableOpacity onPress={onSignInPress} style={[defaultStyles.btn, styles.btnPrimary]}>
        <Text style={styles.btnPrimaryText}>Login</Text>
      </TouchableOpacity>
    ):(
      <TouchableOpacity onPress={onSignUpPress} style={[defaultStyles.btn, styles.btnPrimary]}>
        <Text style={styles.btnPrimaryText}>Create account</Text>
    </TouchableOpacity>
    )}

    {/* ✅ POPUP FOR CODE ENTRY */}
    <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <TextInput
              placeholder="Enter 6-digit code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              style={styles.inputField}
            />
            <TouchableOpacity onPress={onVerifyCodePress} style={[defaultStyles.btn, styles.btnPrimary]}>
              <Text style={styles.btnPrimaryText}>Verify</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: 'center',
    marginVertical: 80,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  cancelButton: {
    marginTop: 10,
    padding: 10,
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
  },
});


export default Page