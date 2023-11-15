import clsx from "clsx"
import { For, Show } from "solid-js"
import { useLocation, useNavigate } from "solid-start"
import { useGlobalState } from "../../GlobalContext/global"
import { useGlobalTopic } from "../../GlobalContext/global-topic"
import { useUser } from "../../GlobalContext/user"
import { useMobius } from "../../root"
import { ui } from "@la/shared"

export default function GuideSidebar() {
  const topic = useGlobalTopic()
  const global = useGlobalState()
  const mobius = useMobius()
  const user = useUser()
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <>
      <div
        class="justify-between w-full flex flex-col h-full dark:text-white text-black"
        style={{ padding: "24px 20px 16px 20px" }}
      >
        <div class="flex gap-[32px] flex-col h-full w-full">
          <div id="Status" class="flex flex-col gap-2">
            <div class="font-bold text-[#696969] text-[14px]">TOPIC STATUS</div>
            <div class="flex gap-2 text-[12px]">
              <ui.FancyButton
                onClick={async () => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    global.setShowMemberOnlyModal(true)
                    return
                  }
                  if (topic.globalTopic.learningStatus === "to_learn") {
                    topic.set("learningStatus", "")
                    await mobius.mutate({
                      updateTopicLearningStatus: {
                        where: {
                          learningStatus: "none",
                          topicName: topic.globalTopic.verifiedTopic
                            ? topic.globalTopic.name
                            : location.pathname.slice(1),
                          verifiedTopic: topic.globalTopic.verifiedTopic
                        },
                        select: true
                      }
                    })
                  } else {
                    console.log("run")
                    topic.set("learningStatus", "to_learn")
                    await mobius.mutate({
                      updateTopicLearningStatus: {
                        where: {
                          learningStatus: "to_learn",
                          topicName: topic.globalTopic.verifiedTopic
                            ? topic.globalTopic.name
                            : location.pathname.slice(1),
                          verifiedTopic: topic.globalTopic.verifiedTopic
                        },
                        select: true
                      }
                    })
                  }
                }}
                active={topic.globalTopic.learningStatus === "to_learn"}
              >
                To Learn
              </ui.FancyButton>
              <ui.FancyButton
                onClick={async () => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    global.setShowMemberOnlyModal(true)
                    return
                  }
                  if (topic.globalTopic.learningStatus === "learning") {
                    topic.set("learningStatus", "")
                    await mobius.mutate({
                      updateTopicLearningStatus: {
                        where: {
                          learningStatus: "none",
                          topicName: topic.globalTopic.verifiedTopic
                            ? topic.globalTopic.name
                            : location.pathname.slice(1),
                          verifiedTopic: topic.globalTopic.verifiedTopic
                        },
                        select: true
                      }
                    })
                  } else {
                    topic.set("learningStatus", "learning")
                    await mobius.mutate({
                      updateTopicLearningStatus: {
                        where: {
                          learningStatus: "learning",
                          topicName: topic.globalTopic.verifiedTopic
                            ? topic.globalTopic.name
                            : location.pathname.slice(1),
                          verifiedTopic: topic.globalTopic.verifiedTopic
                        },
                        select: true
                      }
                    })
                  }
                }}
                active={topic.globalTopic.learningStatus === "learning"}
              >
                Learning
              </ui.FancyButton>
              <ui.FancyButton
                onClick={async () => {
                  if (!user.user.signedIn) {
                    localStorage.setItem("pageBeforeSignIn", location.pathname)
                    navigate("/auth")
                    return
                  }
                  if (!user.user.member) {
                    global.setShowMemberOnlyModal(true)
                    return
                  }
                  if (topic.globalTopic.learningStatus === "learned") {
                    topic.set("learningStatus", "")
                    await mobius.mutate({
                      updateTopicLearningStatus: {
                        where: {
                          learningStatus: "none",
                          topicName: topic.globalTopic.verifiedTopic
                            ? topic.globalTopic.name
                            : location.pathname.slice(1),
                          verifiedTopic: topic.globalTopic.verifiedTopic
                        },
                        select: true
                      }
                    })
                  } else {
                    topic.set("learningStatus", "learned")
                    await mobius.mutate({
                      updateTopicLearningStatus: {
                        where: {
                          learningStatus: "learned",
                          topicName: topic.globalTopic.verifiedTopic
                            ? topic.globalTopic.name
                            : location.pathname.slice(1),
                          verifiedTopic: topic.globalTopic.verifiedTopic
                        },
                        select: true
                      }
                    })
                  }
                }}
                active={topic.globalTopic.learningStatus === "learned"}
              >
                Learned
              </ui.FancyButton>
            </div>
          </div>
          <Show
            when={
              topic.globalTopic.verifiedTopic &&
              topic.globalTopic.latestGlobalGuide?.sections.length > 0 &&
              global.state.guidePage === "Guide"
            }
          >
            <div id="Info" class="text-[#696969] flex flex-col gap-3">
              <div class="font-bold">Sections</div>
              <div class="text-[14px] pl-3 flex flex-col gap-2">
                <For each={topic.globalTopic?.latestGlobalGuide?.sections}>
                  {(section) => {
                    return (
                      <>
                        <div
                          onClick={() => {
                            const specificSpot = document.getElementById(
                              section.title
                            )
                            const scrollContainer =
                              document.getElementById("InfoMain")
                            if (specificSpot) {
                              scrollContainer!.scrollTo({
                                top: specificSpot.offsetTop - 15,
                                behavior: "smooth"
                              })
                            }
                          }}
                          class="cursor-pointer"
                        >
                          {section.title}
                        </div>
                      </>
                    )
                  }}
                </For>
              </div>
            </div>
          </Show>
          <Show
            when={
              topic.globalTopic.verifiedTopic &&
              topic.globalTopic.latestGlobalGuide?.sections.length > 0
            }
          >
            <div class="flex text-[#696969] flex-col gap-3">
              <div class="font-bold">Resources</div>
              <div class="flex flex-col pl-3 text-[14px] gap-[6px]">
                <div
                  class={clsx(
                    "flex gap-2 cursor-pointer",
                    global.state.guidePage === "Guide" &&
                      "font-bold text-black dark:text-white text-opacity-70 dark:text-opacity-70"
                  )}
                  onClick={() => {
                    global.setGuidePage("Guide")
                  }}
                >
                  Guide <span class="font-bold">{}</span>
                </div>
                <div
                  class={clsx(
                    "flex gap-2 cursor-pointer",
                    global.state.guidePage === "Links" &&
                      "font-bold text-black dark:text-white text-opacity-70 dark:text-opacity-70"
                  )}
                  onClick={() => {
                    global.setGuidePage("Links")
                  }}
                >
                  Links{" "}
                  <span class="font-bold">
                    {topic.globalTopic.links.length}
                  </span>
                </div>
                <Show when={topic.globalTopic.notesCount}>
                  <div
                    class={clsx(
                      "flex gap-2 cursor-pointer",
                      global.state.guidePage === "Notes" &&
                        "font-bold text-black dark:text-white text-opacity-70 dark:text-opacity-70"
                    )}
                    onClick={() => {
                      if (!user.user.signedIn) {
                        localStorage.setItem(
                          "pageBeforeSignIn",
                          location.pathname
                        )
                        navigate("/auth")
                        return
                      }
                      if (!user.user.member) {
                        global.setShowMemberOnlyModal(true)
                      } else {
                        // TODO:
                        global.setGuidePage("Notes")
                      }
                    }}
                  >
                    Notes{" "}
                    <span class="font-bold">
                      {topic.globalTopic.notesCount}
                    </span>
                  </div>
                </Show>
              </div>
            </div>
          </Show>
          {/* <div id="Learners" class="text-[#696969]">
          <Card name="Learners"></Card>
        </div> */}
        </div>
        <div class="flex gap-4 [&>*]:opacity-50 justify-end items-center">
          <a
            class="hover:opacity-100 transition-all cursor-pointer text-current"
            href="https://twitter.com/learnanything_"
          >
            <ui.Icon name="X" />
          </a>
          <a
            class="hover:opacity-100 transition-all cursor-pointer text-current"
            href="https://discord.com/invite/bxtD8x6aNF"
          >
            <ui.Icon name="Discord" />
          </a>
          <a
            class="hover:opacity-100 transition-all cursor-pointer text-current"
            href="https://github.com/learn-anything/learn-anything.xyz"
          >
            <ui.Icon name="Github" />
          </a>
        </div>
      </div>
    </>
  )
}
