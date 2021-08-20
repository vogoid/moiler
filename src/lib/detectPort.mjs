import fs from 'fs'

export default function detectPort() {
  const regex = new RegExp('(cu|tty)*.(usb|USB)', 'g')
  const port = fs.readdirSync('/dev/').find((fn) => fn.match(regex))
  if (port) return '/dev/' + port
}
