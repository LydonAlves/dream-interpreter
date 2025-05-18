import { Dream } from '@/types/dream';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Symbols = Pick<Dream, 'title' | 'symbols'>;

const SymbolsComponent = ({title, symbols} : Symbols) => {
   const [openText, setOpenText] = useState(false)

  return (
    <View>
      <TouchableOpacity
        style={styles.accordionContainer}
        onPress={() => setOpenText((open) => !open)}
        activeOpacity={0.8}
        >
        <View style={styles.headerRow}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons
              name={openText ? 'chevron-up' : 'chevron-down'}
              size={20}
              style={styles.chevron}
            />
        </View>
      </TouchableOpacity>

      {openText && symbols.map((item, i) => (
        <View key={i} style={styles.symbolsBlocks}>
            <Text style={styles.symbolText}>🔸 {item.symbol}</Text>
            <Text style={styles.meaningText}>{item.meaning}</Text>
        </View>
      ))}
      
    </View>
  )
}

export default SymbolsComponent

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
  symbolContainer: {
    flexDirection: 'column',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#444',
  },
  symbolsBlocks:{
    marginTop: 5,
    marginBottom: 5,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  meaningText: {
    fontSize: 14,
    marginTop: 4,
    marginLeft: 8,
    color: '#ccc',
  },
})