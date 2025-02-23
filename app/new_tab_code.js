import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

const pages = [
    {
      name: 'Teams',
      link: "/teams"
    },
    {
      name: 'Schedules',
      link: "/schedules"
    },
    {
      name: 'Info',
      link: "/info"
    },
    {
      name: 'Photos',
      link: "/photos"
  
    },
    {
      name: 'Sponsors',
      link: "/sponsors"
    },
    {
      name: 'Announcements',
      link: "/announcements"
    }
  ]

export default function Example() {
  return (
    <div className="flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup>
          <TabList className="flex gap-4">
            {categories.map(({ name }) => (
              <Tab
                key={name}
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                <Link className="col-span-1" href={pages.link}>{pages.name}</Link>
                {name}
              </Tab>
            ))}
          </TabList>
          
        </TabGroup>
      </div>
    </div>
  )
}
