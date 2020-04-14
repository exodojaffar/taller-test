import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

import Button from 'grommet/components/Button'
import LogoutIcon from 'grommet/components/icons/base/Logout'
import Router from 'next/router'

const mutation = gql`
  mutation UserLogout {
    userLogout {
      uid
      name
    }
  }
`
const LogoutContainer = () => (
  <Mutation mutation={ mutation }>
    { mutate => (
      <Button icon={ <LogoutIcon /> } onClick={ () => {
        mutate()
        Router.push("/")
      } } />
    )}
  </Mutation>
)

LogoutContainer.propTypes = {
  children: func,
}

export default LogoutContainer
