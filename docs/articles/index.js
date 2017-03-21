import Installation from './getting-started/Installation.md'
import Introduction from './getting-started/Introduction.md'
import ManagingConcurrency from './core-concepts/ManagingConcurrency.md'
import TaskProperty from './API/TaskProperty.md'
import TaskInstance from './API/TaskInstance.md'
import ControllingState from './examples/ControllingState.md'
// import QuestionGenie from './examples/LoadingUi.md'
// import FunctionThrottling from './examples/FunctionThrottling.md'

let guide = {
      Installation,
      Introduction,
      ManagingConcurrency,
      TaskProperty,
      TaskInstance
    },
    examples = {
      ControllingState
      // QuestionGenie,
      // FunctionThrottling
    }

export {
  guide,
  examples
}
