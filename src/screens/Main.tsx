import React from 'react';
import {ContentView, Header, Layout} from 'react-native-pieces';
import { Text } from 'react-native';
import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';

export default function Main({navigation}) {
    return (
        <Layout>
            <Header title={'Progress'} navigation={navigation} buttons={[
                {faIcon: faFloppyDisk, handleClick: ()=>{navigation.push("IO")}}
            ]} />
            <ContentView>
                <Text>{'Main page of Progress'}</Text>
            </ContentView>
        </Layout>
    )
}