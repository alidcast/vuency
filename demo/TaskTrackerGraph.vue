<template>
  <div>
    <button @click="runTrackerInstance"> task.run() </button>

    <svg class="trackerGragh">
      <g  class="taskTimeLine">
        <line
          :x1="xTimeLine + '%'"
          y1="0"
          :x2="xTimeLine + '%'"
          y2="100"
          stroke="black" />
      </g>
      <template
          v-for="instance in trackedInstances"
          v-if="instance.hasStarted">
        <g class="taskTrackerInstance">
          <rect
            :x="instance.g.x + '%'"
            :y="instance.g.y"
            :width="instance.g.width + '%'"
            :height="instance.g.height"
            :fill="instance.g.color" fill-opacity=0.3
            stroke="black" />
          <text
            :x="instance.g.x + 0.5 + '%'"
            :y="instance.g.y + 15"
            :fill="instance.g.color"
            :text-decoration="[instance.taskInstance.isCanceled ? 'line-through' : 'none']"
            :font-style="[instance.startTime ? 'normal' : 'italic']"
            font-family="Raleway" font-size="14">
            {{ instance.taskInstance.state }}
          </text>
        </g>
      </template>
    </svg>
  </div>
</template>

<script>
import Vue from 'vue'

//
// TODO
// - DRopped not showing up - getting dropped but still being executed?
// - restart is taking long

/** TODO consider making timers part of tp
 * Enhance task property so that I can be used for tracker graph.
 */
function createTrackerInstance(host) {
  let colors = [ 'red', 'green', 'blue' ],
      labelHeights = [0, 20, 40, 60, 80, 100 ]

  return {
    id: host.nextId++,
    calledTime: host.timeElapsed,
    hasStarted: false, // has its own start flag so that dropped tasks are shown
    startTime: false,
    endTime: false,
    taskInstance: false,

    g: {
      height: 20,
      width: 0,
      x: 0,
      y: pickFrom(labelHeights, host.nextId),
      color: pickFrom(colors, host.nextId)
    },

    startTracking() {
      this.hasStarted = true
      this.startTime = host.timeElapsed || 1
    },

    endTracking() {
      this.endTime = host.timeElapsed
    },

    update(currTime, upper, lower) {
      let ti = this.taskInstance,
          start = this.startTime
      this.endTime = currTime
      if (!ti.isFinished) this.g.width = scale(width(this, upper), upper, lower)
      this.g.x = scale(start - lower, upper, lower)
    }
  }
}

export default {
  props: {
    flow: {
      type: String, required: true
    }
  },

  data() {
    return {
      trackedInstances: [],
      startTime: false,
      timeElapsed: 0,
      nextId: 0,
      xTimeLine: 0
    }
  },

  tasks(t, { pause }) {
    return {
      trackerTask: t(function * (trackerInstance) {
        trackerInstance.startTracking()
        try {
          yield pause(2000)
        }
        finally {
          trackerInstance.endTracking()
        }
      }).flow(this.flow),

      ticker: t(function * () {
        while (true) {
          this.timeElapsed = new Date() - this.startTime
          window.requestAnimationFrame(this.updateInstances)
          yield pause(10)
        }
      }).flow('drop')
    }
  },

  computed: {
    lowerLimit() {
      if (!this.trackedInstances) return 0
      let runTimes = []
      this.trackedInstances.forEach(instance => {
        runTimes.push(instance.calledTime)
      })
      return Math.min(...runTimes)
    },

    upperLimit() {
      return Math.max(10000, this.timeElapsed);
    }
  },

  methods: {
    runTrackerInstance() {
      this.startTime = this.startTime || new Date()
      let instance = createTrackerInstance(this)
      instance.taskInstance = this.trackerTask.run(instance)
      this.trackedInstances.push(instance)
      this.ticker.run()
    },

    updateInstances() {
      let tracker = this,
          currTime = this.timeElapsed,
          upper = this.upperLimit, lower = this.lowerLimit

      window.requestAnimationFrame(() => {
        tracker.xTimeLine = scale(currTime, upper, lower)
        tracker.trackedInstances.forEach(instance => {
          instance.update(currTime, upper, lower)
        })
      })
    }
  }
}

function scale(value, upper, lower) {
  return Math.abs(100 * value / (upper + 1000 - lower))
}

function width(instance, upper) {
  let start = instance.startTime, end = instance.endTime
  return (end === Infinity) ? upper - start : end - start
}

function pickFrom(list, index) {
  return list[index % list.length]
}

</script>


<style>
.trackerGragh {
  width: 100%;
  padding: 5px;
}

.taskTrackerInstance {
  height: 20px;
}
</style>
