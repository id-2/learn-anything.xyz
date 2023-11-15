import { UserClient } from "@teamhanko/hanko-frontend-sdk"
import {
  createContext,
  createEffect,
  createMemo,
  onMount,
  useContext
} from "solid-js"
import { createStore } from "solid-js/store"
import { MobiusType } from "../root"
import { getHankoCookie } from "@la/shared/lib"
import { useLocation } from "solid-start"

type Topic = {
  name: string
  prettyName: string
  verified: boolean
}

type Link = {
  id: string
  title: string
  description?: string
  url: string
  year?: string
}

type User = {
  username: string
  email: string
  signedIn: boolean | undefined
  member: boolean | undefined
  admin: boolean | undefined
  topicsToLearn: Topic[]
  topicsToLearning: Topic[]
  topicsLearned: Topic[]
  likedLinks: Link[]
  completedLinks: Link[]
  personalLinks: Link[]
  globalLinks: Link[]
  stripePlan?: string
  memberUntil?: string
  subscriptionStopped?: boolean
}

// global state of user
export function createUserState(mobius: MobiusType) {
  const [user, setUser] = createStore<User>({
    username: "",
    email: "",
    signedIn: undefined,
    member: undefined,
    admin: undefined,
    topicsToLearn: [],
    topicsToLearning: [],
    topicsLearned: [],
    likedLinks: [],
    personalLinks: [],
    completedLinks: [],
    globalLinks: [],
    stripePlan: "",
    subscriptionStopped: true
  })

  createMemo(() => {
    const combinedLinks = [...user.likedLinks, ...user.completedLinks]
    const uniqueLinks = Array.from(
      new Set(combinedLinks.map((link) => link.id))
    )
      .map((id) => combinedLinks.find((link) => link.id === id))
      .filter((link): link is Link => link !== undefined)

    setUser("globalLinks", uniqueLinks)
  })

  onMount(async () => {
    // if (location.pathname === "/") return
    // TODO: maybe not needed? if only userClient.getCurrent() is there
    // it flashes sign in button on reloads..
    if (getHankoCookie()) {
      setUser({ signedIn: true })
    }
    // TODO: do grafbase call to get user info like username and email from server
    const userClient = new UserClient(import.meta.env.VITE_HANKO_API, {
      timeout: 0,
      cookieName: "hanko",
      localStorageKey: "hanko"
    })
    const hankoUser = await userClient.getCurrent()
    const email = hankoUser.email
    setUser({ email, signedIn: true })

    const res = await mobius.query({
      getUserDetails: {
        isMember: true
      }
    })
    if (res) {
      // @ts-ignore
      setUser({ member: res?.data?.getUserDetails.isMember })
    }

    const hankoCookie = await getHankoCookie()
    if (hankoCookie) {
      setUser({ signedIn: true })
    }
  })

  const likedLinksSearch = createMemo(() => {
    return [...user.likedLinks, ...user.personalLinks].map((link) => ({
      name: link.title
    }))
  })

  const location = useLocation()
  createEffect(async () => {
    if (location.pathname === "/pricing" && user.member) {
      const res = await mobius.query({
        getPricingUserDetails: {
          stripePlan: true,
          memberUntil: true,
          subscriptionStopped: true
        }
      })
      // @ts-ignore
      const data = res?.data?.getPricingUserDetails
      setUser("stripePlan", data.stripePlan)
      setUser("memberUntil", data.memberUntil)
      setUser("subscriptionStopped", data.subscriptionStopped)
    }
  })
  createEffect(async () => {
    if (!(location.pathname === "/profile")) return
    const res = await mobius.query({
      getTopicsLearned: {
        topicsToLearn: {
          name: true,
          prettyName: true,
          verified: true
        },
        topicsLearning: {
          name: true,
          prettyName: true,
          verified: true
        },
        topicsLearned: {
          name: true,
          prettyName: true,
          verified: true
        }
      },
      getLikedLinks: {
        likedLinks: {
          id: true,
          title: true,
          url: true
        },
        completedLinks: {
          id: true,
          title: true,
          url: true
        },
        personalLinks: {
          id: true,
          title: true,
          url: true
        }
      }
    })
    // @ts-ignore
    const topicsLearned = res?.data?.getTopicsLearned
    // @ts-ignore
    const links = res?.data?.getLikedLinks
    const likedLinks = links.likedLinks
    const completedLinks = links.completedLinks
    const personalLinks = links.personalLinks
    setUser({
      topicsToLearn: topicsLearned.topicsToLearn,
      topicsToLearning: topicsLearned.topicsLearning,
      topicsLearned: topicsLearned.topicsLearned,
      likedLinks: likedLinks,
      completedLinks: completedLinks,
      personalLinks: personalLinks
    })
  })

  return {
    user,
    set: setUser,
    setEmail: (state: string) => {
      return setUser({ email: state })
    },
    setSignedIn: (state: boolean) => {
      return setUser({ signedIn: state })
    },
    likedLinksSearch
  } as const
}

const UserCtx = createContext<ReturnType<typeof createUserState>>()

export const UserProvider = UserCtx.Provider

export const useUser = () => {
  const ctx = useContext(UserCtx)
  if (!ctx) throw new Error("useUser must be used within UserProvider")
  return ctx
}
