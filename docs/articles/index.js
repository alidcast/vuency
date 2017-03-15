import Introduction from './guide/getting-started/Introduction.md'
import ManagingConcurrency from './guide/core-concepts/ManagingConcurrency.md'
import ControllingState from './examples/ControllingState.md'
// import QuestionGenie from './examples/LoadingUi.md'
// import FunctionThrottling from './examples/FunctionThrottling.md'

let guide = {
      Introduction,
      ManagingConcurrency
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
