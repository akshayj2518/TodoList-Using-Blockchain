App = {
  loading: false,
  contracts: {},
  connected: false,

  load: async () => {
    await App.loadWeb3()
    await App.loadAccount()
    await App.loadContract()
    await App.render()
    await App.renderTasks()
  },

  loadWeb3: async () => {

    if (window.ethereum) {
      const ethereum = window.ethereum
      window.web3Provider = new Web3(ethereum)
    } else {
      window.alert("Please connect to Metamask.")
    }
  },

  loadAccount: async () => {

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      })
      App.account = accounts[0]
      // console.log(App.account)
    } catch (error) {
      if (error.code === 4001) {
        // User rejected request
        window.alert("User Rejected connection request")
      }
      setError(error)
    }
  },

  loadContract: async () => {
    const todoList = await $.getJSON('TodoList.json')
    App.contracts.TodoList = TruffleContract(todoList)
    App.contracts.TodoList.setProvider(web3Provider.currentProvider)
    App.todoList = await App.contracts.TodoList.deployed()
    // console.log(App.todoList)
  },

  render: async () => {
    if (App.loading) {
      return
    }

    // Update app loading state
    App.setLoading(true)

    // Render Account
    $('#account').html(App.account)

    // Render Tasks
    // await App.renderTasks()

    // Update loading state
    App.setLoading(false)
  },

  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },

  renderTasks: async () => {
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')
    // console.log(App.todoList.tasks(1))

    for (var i = 1; i <= taskCount; ++i) {

      App.todoList.tasks(i).then(function(task) // Using Promise's then function as App.todoList.tasks(i) is returning a promise object
        {
          const taskId = task[0].toNumber()
          const taskContent = task[1]
          const taskCompleted = task[2]

          console.log(taskContent)
          const $newTaskTemplate = $taskTemplate.clone()
          $newTaskTemplate.find('.content').html(taskContent)
          $newTaskTemplate.find('input')
            .prop('name', taskId)
            .prop('checked', taskCompleted)
          // .on('click', App.toggleCompleted)

          if (taskCompleted) {
            $('#completedTaskList').append($newTaskTemplate)
          } else {
            $('#taskList').append($newTaskTemplate)
          }
       $newTaskTemplate.show()
        });


    }
  }



}


$(() => {
  $(window).load(() => {
    App.load()
  })
})