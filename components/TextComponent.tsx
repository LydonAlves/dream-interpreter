import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { GestureResponderEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TextComponentProps = {
  title: string;
  textToShow: string;
}

const TextComponent = ({title, textToShow} : TextComponentProps) => {
  const [openText, setOpenText] = useState(false)


  return (
    <View>
      <TouchableOpacity
        style={styles.accordionContainer}
        onPress={() => setOpenText((open) => !open)}
        activeOpacity={0.8}
        >
          <View style={styles.headerRow}>
          <Text style={styles.accordionTitle} >{title}</Text>
          <Ionicons
                name={openText ? 'chevron-up' : 'chevron-down'}
                size={20}
                style={styles.chevron}
              />
          </View>
      </TouchableOpacity>

      {openText && (
        <Text style={styles.accordionBodyText}>{textToShow}</Text>
      )}
        
    </View>
  )
}

export default TextComponent

const styles = StyleSheet.create({
  accordionContainer: {           
    flexDirection: 'column',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerRow: {                  
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  chevron: {
    color: '#fff',
  },
  accordionBodyText: {           
    fontSize: 14,
    marginTop: 8,
    marginLeft: 12,
    color: '#fff',
  },
});
