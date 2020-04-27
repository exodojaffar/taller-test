/**
 * This is the page rendered when inside a chat room.
 */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Link from 'next/link'

import { HashLoader } from 'react-spinners'
import App from 'grommet/components/App'
import ChatIcon from 'grommet/components/icons/base/Chat'
import AddCircleIcon from 'grommet/components/icons/base/Add'
import Split from 'grommet/components/Split'
import Sidebar from 'grommet/components/Sidebar'
import Header from 'grommet/components/Header'
import Footer from 'grommet/components/Footer'
import Title from 'grommet/components/Title'
import Box from 'grommet/components/Box'
import Menu from 'grommet/components/Menu'
import Anchor from 'grommet/components/Anchor'
import Button from 'grommet/components/Button'
import Paragraph from 'grommet/components/Paragraph'
import Label from 'grommet/components/Label'
import LogoutContainer from 'app/modules/auth/containers/LogoutContainer'
import Router from 'next/router'

import { Offline } from 'react-detect-offline'

import ReactGravatar from 'react-gravatar'

import bootstrap from 'app/lib/bootstrap'
import TextInput from 'app/modules/form/components/TextInput'

const StyledRoomHeader = styled(Header)`
  border-bottom: 1px solid #ddd;
`

const StyledMessage = styled(Paragraph)`
  margin: 0 0 0 15px;
  color: black;
`

const StyledChatBoxMessage = styled(Paragraph)`
  height: 57vh;
  overflow: auto;
  flex: auto;
  margin: 0;
  min-width: 100%;
`

const StyledAuthor = styled(Label)`
  margin: 0;
  font-weight: bold;
`

const StyledMessageDate = styled(Label)`
  font-size: 0.75em;
`

const StyledTextInput = styled(TextInput)`
  width: 100%;
`

const AddChannelButton = styled(Button)`
  margin-left: auto;
`

const AvatarBox = styled(Button)`
  opacity: 1;
  .react-gravatar{
    border-radius: 100%;
    margin-right: 5px;
    height: 45px;
    width: 45px;
    border: 2px solid rgba(0, 0, 150, 0.4);
  }
`

const ConnectionBox = styled(Button)`
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 9999;
  color: white;
  opacity: 1;
  font-weight: bold;
`

const formatDate = (int) => {
  let date = new Date(int * 1000);
  let frmt = date.getFullYear() + "-" +
    (date.getMonth() + 1).toString().padStart(2, '0') + "-" +
    date.getDate().toString().padStart(2, '0') + " " +
    date.getHours().toString().padStart(2, '0') + ":" +
    date.getMinutes().toString().padStart(2, '0') + ":" +
    date.getSeconds().toString().padStart(2, '0');
  return frmt;
}

const LoadingComponent = () => (
  <Box full='vertical' justify='center' align='center'>
    <HashLoader color='#e02438' loading />
  </Box>
)

const scrollChatBottom = () => {
  setTimeout(() => {
    document.querySelector("#channel-chat-box").scrollTo(0, document.querySelector("#channel-chat-box").scrollHeight);
  })
}

import CurrentUserContainer from 'app/modules/auth/containers/CurrentUserContainer'
import ChannelsContainer from 'app/modules/channel/containers/ChannelsContainer'
import MessagesContainer from 'app/modules/channel/containers/MessagesContainer'
import NewMessageContainer from 'app/modules/channel/containers/NewMessageContainer'
import NewChannelContainer from 'app/modules/channel/containers/NewChannelContainer'

const ChatRoom = ({ url, url: { query: { channel = 'general' } } }) => {

  return (<CurrentUserContainer>
    { ({ user }) => (() => {
      if (!user || !user.uid) {
        return (
          <Box full='vertical' justify='center' align='center'>
            User not found! :(
            <Button primary
              label='Login/Register'
              onClick={() => {
                Router.push('/')
              }}
            />
          </Box>
        );
      }
      return (
        <ChannelsContainer>
          { ({ loading, channels }) => (
            (loading && !channels.length) ? <LoadingComponent /> : (
              <App centered={ false }>
                <Offline>
                  <ConnectionBox>Connection lost!</ConnectionBox>
                </Offline>
                <Split fixed flex='right'>
                  <Sidebar colorIndex='neutral-1'>
                    <Header pad='medium'>
                      <Title>
                        TallerChat <ChatIcon />
                      </Title>

                      <NewChannelContainer channels={ channels }>
                        { create => (
                          <AddChannelButton
                            icon={ <AddCircleIcon /> }
                            onClick={ () => create(
                              window.prompt('Name your new channel')
                            ) }
                          />
                        ) }
                      </NewChannelContainer>
                    </Header>

                    <Box flex='grow' justify='start'>
                      <Menu primary>
                        { channels.map(({ name }) => (
                            <Link key={ name } prefetch as={`/messages/${name}`} href={ {
                              pathname: '/channel',
                              query: { channel: name }
                            } }>
                            <Anchor className={ channel === name ? 'active' : '' }>
                              # <b>{ name }</b>
                            </Anchor>
                          </Link>
                        )) }
                      </Menu>
                    </Box>

                    <Footer pad='medium'>
                      <AvatarBox>
                        <ReactGravatar email={ user.mail } />
                      </AvatarBox>
                      <LogoutContainer/>
                    </Footer>
                  </Sidebar>

                  { !user || !user.uid ? (
                    <LoadingComponent />
                  ) : (
                    <MessagesContainer channel={ channels.find(({ name }) => name === channel) }>
                      { ({ loading, messages }) => (
                        <Box full='vertical'>
                          <StyledRoomHeader pad={ { vertical: 'small', horizontal: 'medium' } } justify='between'>
                            <Title>
                              { '#' + channel }
                            </Title>
                          </StyledRoomHeader>

                          <Box pad='medium' flex='grow'>
                            <StyledChatBoxMessage id='channel-chat-box'>
                              { loading ? 'Loading...' : (
                                messages.length === 0 ? 'No one talking here yet :(' : (
                                  messages.map(({ author, message, created }) => {
                                    scrollChatBottom()
                                    return (
                                      <Box pad='small' credit={ author.name }>
                                        <StyledAuthor>
                                          <AvatarBox>
                                            <ReactGravatar email={ author.mail || author.name + "Taller" } />
                                          </AvatarBox>
                                          <StyledMessageDate>[{formatDate(created)}] </StyledMessageDate>
                                          <span> { author.name }:</span>
                                        </StyledAuthor>
                                        <StyledMessage>{ message }</StyledMessage>
                                      </Box>
                                    )
                                  })
                                )
                              ) }
                            </StyledChatBoxMessage>
                          </Box>

                          <Box pad='medium' direction='column'>
                            { user && user.uid ? (
                              <NewMessageContainer
                                user={ user }
                                channel={ channels.find(({ name }) => name === channel) }
                              >
                                { ({ handleSubmit }) => (
                                  <form onSubmit={ handleSubmit }>
                                    <NewMessageContainer.Message
                                      placeHolder={ `Message #${channel}` }
                                      component={ StyledTextInput }
                                    />
                                  </form>
                                ) }
                              </NewMessageContainer>
                            ) : (
                              'Log in to post messages'
                            ) }
                          </Box>
                        </Box>
                      ) }
                    </MessagesContainer>
                  ) }

                </Split>
              </App>
            )
          ) }
        </ChannelsContainer>
      ) }
    )() }
  </CurrentUserContainer>
)}

ChatRoom.propTypes = {
  url: PropTypes.object.isRequired,
}

export default bootstrap(ChatRoom)
