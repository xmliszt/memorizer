<template>
  <div class="memory">
    <div class="empty-warning" v-show="empty">
      You have no recorded memory.
      <el-link type="warning" href="/">Go and add some first!</el-link>
    </div>
    <div class="memory-table">
      <el-table :data="memoryData" style="width: 100%">
        <el-table-column prop="index" label="S/N" width="80" sortable></el-table-column>
        <el-table-column prop="created_on" label="Created on" width="250" sortable></el-table-column>
        <el-table-column prop="type" label="Type" width="100" sortable></el-table-column>
        <el-table-column label="Question / Title">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'q_a'">{{scope.row.q}}</span>
            <span v-if="scope.row.type === 'link'">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="Answer / Link">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 'q_a'" class="long-answer" >{{scope.row.a}}</span>
            <el-link
              v-if="scope.row.type === 'link'"
              :href="scope.row.link"
              type="info"
              target="_blank"
            >{{scope.row.link}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="next_date" label="Next Revision" width="250" sortable></el-table-column>
        <el-table-column prop="revised" label="R" width="80" sortable></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { app, db } from "./../../firebase";
import { formatDate, getRevisionDateFromCount } from "@/controllers/memoryController"
import moment from "moment";
import router from "@/router";
export default {
  data() {
    return {
      empty: false,
      memoryData: [],
    };
  },
  mounted() {
    var user = app.auth().currentUser;
    if (!user) {
      this.$notify.warning("You are not logged in!");
      router.push("/");
    } else {
      const userRef = db.collection("users").doc(user.uid);
      userRef
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            userRef
              .collection("m")
              .get()
              .then((snapshot) => {
                if (snapshot.docs.length == 0) {
                  this.empty = true;
                } else {
                  this.memoryData = snapshot.docs.map((doc, idx) => ({
                    index: idx,
                    created_on: formatDate(doc.data().created_on),
                    type: doc.data().type,
                    revised: doc.data().revised,
                    q: doc.data().q,
                    a: doc.data().a,
                    link: doc.data().link,
                    title: doc.data().title,
                    next_date: formatDate(getRevisionDateFromCount(doc.data().created_on, doc.data().revised))
                  }));
                }
              })
              .catch((err) => {
                var errorCode = err.code;
                var errorMessage = err.message;
                this.$message.error(errorCode + ": " + errorMessage);
              });
          } else {
            userRef.set({
              email: user.email,
              verified: user.emailVerified,
              username: user.displayName,
            });
            this.empty = true;
          }
        })
        .catch((err) => {
          var errorCode = err.code;
          var errorMessage = err.message;
          this.$message.error(errorCode + ": " + errorMessage);
        });
    }
  },
};
</script>

<style scoped>
.memory {
  padding: 20px;
}
.empty-warning {
  margin-top: 30px;
  text-align: center;
  font-size: 15px;
  color: grey;
}
.long-answer {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.long-answer:hover {
  word-break: normal;
  text-overflow: unset;
  white-space: normal;
}
</style>