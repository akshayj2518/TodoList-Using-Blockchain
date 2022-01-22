const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('lists tasks', async () => {
    const taskCount = await this.todoList.taskCount()
    const task = await this.todoList.tasks(taskCount)
    assert.equal(task.id.toNumber(), taskCount.toNumber())
    assert.equal(task.content, 'Be Happy')
    assert.equal(task.completed, false)
    assert.equal(taskCount.toNumber(), 1)
  })

  it('created tasks', async () =>{

    const result = await this.todoList.createTask('Read atleast 30 pages')
    const taskCount = await this.todoList.taskCount()
    assert.equal(taskCount,2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(),taskCount)
    assert.equal(event.content,'Read atleast 30 pages')
    assert.equal(event.completed,false)
  })

  it('completed tasks', async () =>{

    const result = await this.todoList.toggleTask(1)
    const taskCount = await this.todoList.taskCount()
    assert.equal(taskCount,2)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(),taskCount)
    assert.equal(event.content,'Read atleast 30 pages')
    assert.equal(event.completed,false)
  })

  })