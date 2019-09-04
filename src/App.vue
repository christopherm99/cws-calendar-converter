<template>
  <v-app>
    <v-content>
      <v-stepper v-model="progress">
        <v-stepper-header>
          <v-stepper-step :complete="progress > 1" step="1">
            Upload PDF
          </v-stepper-step>
          <v-divider />
          <v-stepper-step :complete="progress > 2" step="2">
            Verify Classes
          </v-stepper-step>
          <v-divider />
          <v-stepper-step step="3">
            Choose Options
          </v-stepper-step>
        </v-stepper-header>
        <v-container id="stepper-contents" fill-height>
          <v-flex align-self-center>
            <v-stepper-items>
              <v-stepper-content step="1">
                <v-file-input
                  label="Schedule"
                  accept="application/pdf"
                  ref="pdf"
                  solo
                  hint="Your schedule pdf, as provided to you by Ms. Jackman"
                  persistent-hint
                  prepend-icon="mdi-pdf-box"
                  @change="onUpload"
                  :loading="loading"
                />
              </v-stepper-content>

              <v-stepper-content step="2">
                <v-card>
                  <v-card-title>
                    Are these classes correct?
                  </v-card-title>
                  <v-card-text>
                    <v-calendar
                      class="elevation-1"
                      hide-header
                      type="custom-daily"
                      start="1969-12-29"
                      end="1970-01-02"
                      :max-days="5"
                      first-interval="7"
                      interval-count="10"
                      interval-minutes="60"
                      interval-height="40"
                      :weekdays="[1, 2, 3, 4, 5]"
                    >
                      <template
                        v-slot:day-body="{ day, timeToY, minutesToPixels }"
                      >
                        <template v-for="event in classMap[day]">
                          <v-hover
                            :key="
                              String(event.begin.hour) +
                                String(event.begin.minute)
                            "
                            v-slot:default="{ hover }"
                          >
                            <div
                              :style="{
                                top: timeToY(event.begin) + 'px',
                                height: minutesToPixels(event.duration) + 'px',
                                backgroundColor:
                                  classColorMap[event.class].base,
                                border:
                                  '1px solid ' + classColorMap[event.class].base
                              }"
                              class="event"
                              :class="hover ? 'elevation-2' : ''"
                            >
                              {{ event.class }} ({{ event.teacher }})
                            </div>
                          </v-hover>
                        </template>
                      </template>
                    </v-calendar>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="progress = 3">
                      Continue
                    </v-btn>
                    <v-btn text @click="progress = 1">Go Back</v-btn>
                  </v-card-actions>
                </v-card>
              </v-stepper-content>

              <v-stepper-content step="3">
                <v-card
                  class="mb-5"
                  color="grey lighten-1"
                  height="200px"
                ></v-card>
                <v-btn color="primary" @click="progress = 1">
                  Continue
                </v-btn>
                <v-btn text @click="progress = 2">Go Back</v-btn>
              </v-stepper-content>
            </v-stepper-items>
          </v-flex>
        </v-container>
      </v-stepper>
    </v-content>
    <v-footer padless>
      <v-col class="text-center" cols="12">
        <a href="https://github.com/christopherm99/cws-calendar-converter">
          Source Code
        </a>
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import parseClasses from "./parseClasses";
import parseColorMap from "./parseColorMap";
import parseClassMap from "./parseClassMap";

export default {
  name: "App",
  data() {
    return {
      progress: 1,
      test: undefined,
      classes: [],
      classMap: {},
      classColorMap: {},
      loading: false
    };
  },
  methods: {
    onUpload(file) {
      if (!file) {
        this.loading = false;
        return;
      }
      this.loading = true;
      const reader = new FileReader();
      reader.addEventListener("load", e => {
        const typedarray = new Uint8Array(e.target.result);
        import("pdfjs-dist/webpack")
          .then(pdfjs => pdfjs.getDocument(typedarray))
          .then(pdf => pdf.getPage(1))
          .then(page => page.getTextContent())
          .then(text => {
            Object.assign(this.classes, parseClasses(text.items));
            this.classColorMap = parseColorMap(this.classes);
            this.classMap = parseClassMap(this.classes);
            this.progress = 2;
            this.loading = false;
          });
      });
      reader.readAsArrayBuffer(file);
    }
  }
};
</script>
<style>
.event {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: 2px;
  color: #ffffff;
  font-size: 12px;
  padding: 3px;
  cursor: pointer;
  margin-bottom: 1px;
  left: 4px;
  position: absolute;
  right: 4px;
  margin-right: 0px;
}

#stepper-contents {
  height: calc(100vh - 72px - 24px - 1.5em);
}
</style>
