import React from 'react'
import { func } from 'prop-types'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'

const mutation = gql`
  mutation CreateChannel ($name: String!) {
    createTaxonomyTermChannel (input: { name: $name }) {
      violations {
        message
        path
        code
      }
      errors
      entity {
        entityId
      }
    }
  }
`

// @TODO: implement optimistic query on channels?

const NewMessageContainer = ({ children, channels }) => (
  <Mutation mutation={ mutation } refetchQueries={ ['Channels'] }>
    { mutate => (
      children(name => {
        if (name) {
          let exists = channels.find(i => i.name === name);
          if (name.match(/[^a-z_\d]/g)) {
            alert('Only lowercase letter, numbers or underscores!');
          } else if (exists) {
            alert(`Channel '${name}' already exists! :(`);
          } else {
            mutate({ variables: { name }});
          }
        }
      })
    ) }
  </Mutation>
)

NewMessageContainer.propTypes = {
  channels: [],
  children: func,
}

export default NewMessageContainer
