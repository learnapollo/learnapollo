export function hashLinkScroll(retryCount: number = 0, retryLimit: number = 300) {
  const {hash} = window.location
  if (hash !== '') {
    window.requestAnimationFrame(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) {
        window.scrollTo(0, element.offsetTop)
      } else if (retryCount < retryLimit) {
        setTimeout(hashLinkScroll(retryCount + 1), 100)
      }
    })
  }
}
