let queue = []
export function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}
let isFlushing = false
function queueFlush() {
  if (!isFlushing) {
    isFlushing = true
    Promise.resolve().then(flushJobs)
  } else {
  }
}
function flushJobs() {
  isFlushing = false
  // 保证先刷新父组件再刷新子组件
  queue.sort((a, b) => a.id - b.id)
  for (let job of queue) {
    job()
  }
  queue.length = 0
}
