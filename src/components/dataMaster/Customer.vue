<template>
  <section id="customer">

    <b-table
      :data="datas"
      :columns="columns"
      :hoverable="true"
      :loading="isLoading" 
      :mobile-cards="true"
      paginated
      per-page="10"
      ref="table"
      detailed
      detail-key="id_customer"
      :show-detail-icon="true"
      :opened-detailed="detailOpened"
      aria-previous-label="Previous page"
      aria-next-label="Next page"
      aria-page-label="Page"
      aria-current-label="Current page">

      <template slot-scope="props">

        <b-table-column 
            field="id_customer" 
            label="No." 
            width="50px"
            centered
            sortable>
          {{ props.index + 1 }}
        </b-table-column>

        <b-table-column 
            field="nama_customer" 
            label="Nama Customer" 
            :searchable="true" 
            sortable>
          {{ props.row.nama_customer }}
        </b-table-column>

        <b-table-column 
            field="alamat" 
            label="Alamat"
            :searchable="true">
          {{ props.row.alamat }}
        </b-table-column>

        <b-table-column
            field="tgl_lahir"
            label="Tangal Lahir"
            width="130px"
            :searchable="true">
            <span class="tag is-success">
            {{ props.row.tgl_lahir }}
          </span>
        </b-table-column>
        
        <b-table-column 
            field="no_telp" 
            label="No. Telp" 
            width="150px"
            :searchable="true">
          <span>
            {{ props.row.no_telp }}
          </span>
        </b-table-column>

        <b-table-column label="Action" width="115px" centered>
          <span>
            <b-button 
                type="is-text" 
                tag="router-link"
                :to="'/cs/form-pelanggan/' + props.row.id_customer"
                rounded>
                  <b-icon icon="pencil" type="is-info"></b-icon>
            </b-button>
            <b-button 
                type="is-text" 
                @click="confirmDelete(props.row.id_customer)" 
                rounded>
                  <b-icon icon="delete" type="is-danger"></b-icon>
            </b-button>
          </span>
        </b-table-column>
      </template>

      <template slot="detail" slot-scope="props">
        <article class="media">
          <div class="media-content">
            <div class="content">
              <div class="columns">
                <div class="column">
                  <p>
                    <strong>Created At : </strong>
                    <small>{{ props.row.created_at }}</small>
                  </p>
                </div>
                <div class="column">
                  <p>
                    <strong>Updated At : </strong>
                    <small>{{ props.row.updated_at }}</small>
                  </p>
                </div>
                <div class="column">
                  <p>
                    <strong>Deleted At : </strong>
                    <small>{{ props.row.deleted_at }}</small>
                  </p>
                </div>
                <div class="column">
                  <p>
                    <strong>Edited By : </strong>
                    <small>{{ props.row.nama_pegawai }}</small>
                  </p>
                </div>
              </div>
            </div>
          </div>
      </article>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              :icon="tableLoadingIcon"
              size="is-large">
            </b-icon>
          </p>
          <p>{{ tableMessage }}</p>
        </div>
      </section>
    </template>

    <template slot="footer">
      <div class="has-text-centered">
        <b-button size="is-medium" 
            type="is-light" 
            icon-left="plus" 
            tag="router-link" 
            to="/cs/form-pelanggan" 
            @click="addData()"
            expanded>
          Tambah
        </b-button>
      </div>
    </template>

    </b-table>

  </section>
</template>

<script>
export default {
  data() {
    return {
      datas: [],
      tableLoadingIcon: 'clock',
      tableMessage: 'Memuat Data',
      detailOpened: [], // Buat nampung index dari detail yang kebuka di tabel
      isLoading: true,
      snackbarMsg: '',
    }
  },
  methods: {
    getData() {
      this.isLoading = true
      var uri = this.$api_baseUrl + "customer"

      if (!this.$session.exists()) {
        this.$router.push('/login');
      }else{
        this.$http.get(uri).then(response => {
          this.datas = response.data.value
          this.tableLoadingIcon = "emoticon-sad"            // Buat kalo user search
          this.tableMessage = 'Tidak ada data yang sesuai'  // Tapi ga ada data sesuai
          this.isLoading = false
        })
        .catch(error => {
          this.errors = error
          this.tableLoadingIcon = "emoticon-sad"
            this.tableMessage = 'Tidak ada Data'
            this.isLoading = false
        })
      }
    },
    deleteData(deleteId) {
      var uri = this.$api_baseUrl + "customer/delete/" + deleteId;
      var pic = { pic: this.$session.get('pegawai').id_pegawai } // PIC ngambil dari id_pegawai yg ada di session
      
      this.$http.put(uri, pic).then(response => {
        this.getData();
        this.snackbarMsg = response
        this.snackbar('Data terhapus!', 'is-success')
      })
      .catch(error => {
        this.errors = error
        this.snackbarMsg = "Terjadi kesalahan... Silahkan coba lagi"
        this.snackbar(this.snackbarMsg, 'is-danger')
      })
    },
    snackbar(message, type) { // Snackbar buat ngasih tau http request berhasil apa nggak
      this.$buefy.snackbar.open({
        duration: 5000, // 5 detik
        message: message, // pesannya
        type: type, // tipe dapetnya dari parameter. Dia bisa 'is-danger' kalo gagal dan 'is-success' kalo berhasil
        position: 'is-bottom-left', // posisi munculnya
        actionText: 'OK',
        queue: false,
      })
    },
    confirmDelete(deleteId) { // Buat ngeluarin modal box Simpan delete
      this.$buefy.dialog.confirm({
        title: 'Hapus Data Customer',
        message: 'Apa anda yakin ingin <b>menghapus</b> customer?',
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => this.deleteData(deleteId)
      })
    }
  },
  mounted() {
    // if (!this.$session.exists()) {
    //   this.$router.push('/login');
    // } else {
    //   this.activeUser = this.$session.get('pegawai')
      this.getData()
  //   }
  },
}
</script>