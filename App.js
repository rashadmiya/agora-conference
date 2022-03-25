import { Text, View, SafeAreaView, StatusBar, Platform, ScrollView, TouchableOpacity } from 'react-native'
import React, { Component } from 'react';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  ClientRole,
  ChannelProfile
} from 'react-native-agora';
// import requestCameraAndAudioPermission from 'agora-rn-uikit/src/permission';
import requestCameraAndAudioPermission from './src/components/Permissions';
import Styles from './src/components/Styles';

const token = '006ec19212e2495450abf091a02d2e5832fIAB8uWX2hS1tqqXAbuLbBLRm/fK3kz6tKRj6Anf73UDPsgx+f9gAAAAAEABHuwtv8wE+YgEAAQDxAT5i';
const appId = 'ec19212e2495450abf091a02d2e5832f';
const channelName = 'test'


export default class App extends Component {

  _engine;
  constructor(props) {
    super(props);
    this.state = {
      isHost: true,
      joinSucceed: false,
      peerIds: [],
    };
    if (Platform.OS == 'android') {
      requestCameraAndAudioPermission().then(() => {
        console.log('requested');
      });
    }
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this._engine?.destroy();
  }

  init = async () => {
    this._engine = await RtcEngine.create(appId);
    await this._engine.enableVideo();
    await this._engine?.setChannelProfile(ChannelProfile.LiveBroadcasting);
    await this._engine?.setClientRole(
      this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
    );

    this._engine.addListener('Warning', (warn) => {
      console.log('Warning', warn);
    });

    this._engine.addListener('Error', (err) => {
      console.log('Error', err);
    });

    this._engine.addListener('UserJoined', (uid, elapsed) => {
      console.log('UserJoined', uid, elapsed);
      const { peerIds } = this.state;
      if (peerIds.indexOf(uid) == -1) {
        this.setState({
          peerIds: [...peerIds, uid],
        });
      }
    });

    this._engine.addListener('UserOffline', (uid, reason) => {
      console.log('UserOffline', uid, reason);
      const { peerIds } = this.state;
      this.setState({
        peerIds: peerIds.filter((id) => id !== uid),
      });
    });

    this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.log('JoinChannelSuccess', channel, uid, elapsed);
      this.setState({
        joinSucceed: true,
      });
    });

    startCall = async() => {
      await this._engine.joinChannel(token, channelName, null, 0);
    };

    endCall = async() => {
      await this._engine.leaveChannel();
      this.setState({ peerIds: [], joinSucceed: false });
    };

    toggleRoll = async() => {
      this.setState({ isHost: !this.state.isHost },
        async () => {
          await this._engine?.setClientRole(
            this.state.isHost ? ClientRole.Broadcaster : ClientRole.Audience
          );
        }
      );
    };
  }

  render() {
    return (
      <View style={Styles.max}>
        <View style={Styles.max}>
          <Text style={Styles.roleText}> You are {this.state.isHost ? 'a broadcaster' : 'the audience'} </Text>
          <View style={Styles.buttonHolder} >
            <TouchableOpacity onPress={this.toggleRoll()} style={Styles.button}>
              <Text style={Styles.buttonText}>Toggle Roll</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.startCall()} style={Styles.button}>
              <Text style={Styles.buttonText}>Start Call</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.endCall()} style={Styles.button}>
              <Text style={Styles.buttonText}>End Call</Text>
            </TouchableOpacity>
          </View>
          {this._renderVideos()}
        </View>
      </View>
    );
  };

  _renderVideos = () => {
    const { joinSucceed } = this.state;
    return joinSucceed ? (
      <View style={Styles.fullView}>
        {this.state.isHost ? (
          <RtcLocalView.SurfaceView style={Styles.max} channelId={channelName} renderMode={VideoRenderMode.Hidden} />
        ) : (
          <></>
        )}
        {this._renderRemoteVideos()}
      </View>
    ) : null;
  }

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView style={Styles.remoteContainer} contentContainerStyle={Styles.remoteContainerContent} horizontal={true}>
        {peerIds.map((value) =>{
          return (
            <RtcRemoteView.SurfaceView
            style={Styles.remote}
            uid={value}
            channelId={channelName}
            renderMode={VideoRenderMode.Hidden}
            zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  }
}

// import { View, Text } from 'react-native'
// import React from 'react'
// import AgoraUIKit from 'agora-rn-uikit'

// const App = () => {

//   let rtcProps = {
//     appid:'afd98a46900c45f0b2de2daf5bcc8b2c',
//     channel:'test',
//   }
//   return <AgoraUIKit rtcProps={rtcProps}/>
// }

// export default App