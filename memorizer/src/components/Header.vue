<template>
  <div class="header-section">
    <div class="signout-holder" v-show="signOutVisible">
      <span class="username">{{ username }}</span>
      <el-tooltip effect="dark" content="Signout" placement="left">
        <el-button type="danger" icon="el-icon-error" circle @click="signout"></el-button>
      </el-tooltip>
    </div>
    <div class="home-holder" v-show="goHomeVisible">
      <el-tooltip effect="dark" content="Add more memory..." placement="right">
        <el-button type="warning" icon="el-icon-s-opportunity" circle @click="goHome"></el-button>
      </el-tooltip>
    </div>
    <el-dialog title="Sign in with Google" :visible.sync="signInVisible" width="30%">
      <span>You need to login to access your memory!</span>
      <br />
      <span>You will be directed to Google Account login page.</span>
      <span slot="footer">
        <el-button @click="signInVisible = false">Cancel</el-button>
        <el-button type="info" @click="signInWithGoogle">Proceed</el-button>
      </span>
    </el-dialog>
    <el-tooltip effect="dark" :content="accessMemoryTooltip" placement="bottom">
      <div class="header-block" @click="accessMemory">
        <div class="Heading">MEMORIZER</div>
        <div class="Subtitle">Help with your memory</div>
      </div>
    </el-tooltip>
  </div>
</template>

<script>
import router from "@/router";
import { app, provider } from "./../../firebase";

export default {
  data() {
    return {
      username: "",
      signInVisible: false,
      signOutVisible: false,
      accessMemoryTooltip: "",
    };
  },
  methods: {
    signInWithGoogle() {
      this.signInVisible = false;
      app
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          var user = result.user;
          var uid = user.uid;
          router.push("/memory/" + uid);
        })
        .catch((err) => {
          var errorCode = err.code;
          var errorMessage = err.message;
          var email = err.email;
          this.$notify.error(
            `Email [${email}] failed to login with error[${errorCode}]: ${errorMessage}`
          );
        });
    },
    accessMemory() {
      var user = app.auth().currentUser;
      if (user) {
        var uid = user.uid;
        router.push("/memory/" + uid);
      } else {
        this.signInVisible = true;
      }
    },
    signout() {
      app
        .auth()
        .signOut()
        .then(() => {
          this.$message.success("Sign out successfully!");
          router.push("/");
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("Failed to signout! Try again later!");
        });
    },
    goHome() {
      router.push("/");
    }
  },
  created() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.signOutVisible = true;
        this.accessMemoryTooltip = "Access your memory...";
        this.username = user.displayName;
      } else {
        this.username = "";
        this.accessMemoryTooltip = "Login to access your memory...";
        this.signOutVisible = false;
      }
    });
  },
  computed: {
    goHomeVisible() {
      return this.$route.name === "Memory";
    },
  },
};
</script>

<style scoped>
.header-section {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.header-block {
  width: 100vw;
  height: 100px;
  background-color: #606266;
  color: #fff;
  padding-top: 20px;
  transition: opacity 0.2s;
}
.header-block:hover {
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}
.Heading {
  font-size: 40px;
  font-weight: 700;
}
.Subtitle {
  font-size: 12px;
  font-weight: 100;
}
.signout-holder {
  position: absolute;
  display: flex;
  align-items: center;
  top: 30px;
  right: 30px;
  z-index: 999;
}
.home-holder {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 999;
}
.username {
  color: #fff;
  margin-right: 20px;
}
</style>