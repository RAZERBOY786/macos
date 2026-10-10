import Finder from '../apps/Finder.jsx'
import Safari from '../apps/Safari.jsx'
import Notes from '../apps/Notes.jsx'
import Photos from '../apps/Photos.jsx'
import Messages from '../apps/Messages.jsx'
import Mail from '../apps/Mail.jsx'
import Terminal from '../apps/Terminal.jsx'
import Music from '../apps/Music.jsx'
import Calculator from '../apps/Calculator.jsx'
import CalendarApp from '../apps/CalendarApp.jsx'
import Reminders from '../apps/Reminders.jsx'
import Maps from '../apps/Maps.jsx'
import Weather from '../apps/Weather.jsx'
import ClockApp from '../apps/ClockApp.jsx'
import Preview from '../apps/Preview.jsx'
import AppStore from '../apps/AppStore.jsx'
import Contacts from '../apps/Contacts.jsx'
import FaceTime from '../apps/FaceTime.jsx'
import Trash from '../apps/Trash.jsx'
import Settings from '../apps/Settings.jsx'
import AboutMac from '../apps/AboutMac.jsx'

export const registry = {
  finder: Finder,
  safari: Safari,
  notes: Notes,
  photos: Photos,
  messages: Messages,
  mail: Mail,
  terminal: Terminal,
  music: Music,
  calculator: Calculator,
  calendar: CalendarApp,
  reminders: Reminders,
  maps: Maps,
  weather: Weather,
  clock: ClockApp,
  preview: Preview,
  appstore: AppStore,
  contacts: Contacts,
  facetime: FaceTime,
  trash: Trash,
  settings: Settings,
  about: AboutMac,
}

export default registry
