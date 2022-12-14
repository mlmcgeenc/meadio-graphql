import ApolloBoost, { gql } from 'apollo-boost'

console.log("App is running")

const client = new ApolloBoost({
  uri: 'http://localhost:4000'
})

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`

const getPosts = gql`
  query {
    posts (first:10){
      title
      body
    }
  }
`

client.query({
  query: getUsers
}).then((response) => {
  let html = ""

  response.data.users.forEach((user) => {
    html += `
      <div>
        <h3>${user.name}</h3>
      </div>
    `
  })

  document.getElementById("users").innerHTML = html
})

client.query({
  query: getPosts
}).then((response) => {
  let html = ""

  response.data.posts.forEach((post) => {
    html += `
    <div>
        <h3>${post.title}</h3>
        <p>${post.body}</p>
    </div>
    `;
  })

  document.getElementById("posts").innerHTML = html
})
