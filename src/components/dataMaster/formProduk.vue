<template>
  <section id="form-produk">
    <h4 class="title is-5">{{ actionTitle}} Data Produk</h4>
    <hr>
    <div class="columns">
      <div class="column is-8">
        <b-field 
            label="Nama Produk" 
            :type="form.nama_produk.type"
            :message="form.nama_produk.message"
            horizontal>
              <b-input @input="clearError(form.nama_produk)" v-model="form.nama_produk.value"></b-input>
        </b-field>

        <b-field 
            label="Satuan" 
            :type="form.satuan.type"
            :message="form.satuan.message"
            horizontal>
              <b-input @input="clearError(form.satuan)" v-model="form.satuan.value"></b-input>
        </b-field>

        <b-field 
            class="file"
            label="Foto Produk" 
            :type="form.gambar.type"
            :message="form.gambar.message"
            horizontal>
              <b-upload v-model="form.gambar.value">
                <a class="button is-primary" @click="btnUploadGambarClick">
                  <b-icon icon="upload"></b-icon>
                  <span>Unggah gambar</span>
                </a>
              </b-upload>
              <input 
                  type="file" 
                  @input="clearError(form.gambar)"
                  @change="previewImage" 
                  accept="image/jpg, image/png, image/jpeg" 
                  ref="inputFile"
                  style="display: none">
        </b-field>

        <div class="image-preview" v-if="form.gambar.value">
          <img class="preview" :src="gambarProduk">
        </div>

        <b-field 
            label="Stok Minimum" 
            :type="form.stok_minimum.type"
            :message="form.stok_minimum.message"
            v-model="form.stok_minimum.value" 
            horizontal>
              <b-numberinput 
                  min="0" 
                  @input="clearError(form.stok_minimum)"
                  v-model="form.stok_minimum.value" 
                  controls-position="compact"
                  controls-rounded>
              </b-numberinput>
        </b-field>

        <b-field 
            label="Stok" 
            :type="form.stok.type"
            :message="form.stok.message"
            v-model="form.stok.value"
            horizontal>
              <b-numberinput 
                  min="0" 
                  @input="clearError(form.stok)"
                  v-model="form.stok.value"
                  controls-position="compact"
                  controls-rounded>
              </b-numberinput>
        </b-field>

        <b-field 
            label="Harga Beli"
            :type="form.harga_beli.type"
            :message="form.harga_beli.message"
            expanded 
            horizontal
            numeric>
              <b-field>
                <b-select placeholder="Rp" disabled>
                </b-select>
                <b-input @input="clearError(form.harga_beli)" v-model="form.harga_beli.value" type="number" placeholder="0,00" expanded></b-input>
              </b-field>
        </b-field>

        <b-field 
            label="Harga Jual"
            :type="form.harga_jual.type"
            :message="form.harga_jual.message"
            expanded 
            horizontal
            numeric>
              <b-field>
                <b-select placeholder="Rp" disabled>
                </b-select>
                <b-input @input="clearError(form.harga_jual)" v-model="form.harga_jual.value" type="number" placeholder="0,00" expanded></b-input>
              </b-field>
        </b-field>

        <div class="has-text-right">
          <b-button 
              size="is-medium" 
              class="btn-form" 
              type="is-dark" 
              tag="router-link" 
              to="/owner/produk" 
              rounded>
                Batal
          </b-button>
          <b-button 
              size="is-medium" 
              class="btn-form" 
              type="is-success" 
              @click="confirm()"
              rounded>
                Simpan
          </b-button>
        </div>

      </div>
    </div>

    <!-- Buat loading page waktu awal load sama submit data -->
    <b-loading 
        :is-full-page="true" 
        :active.sync="isLoading" 
        :can-cancel="false">
    </b-loading>
  
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      actionTitle: '',
      gambarProduk:'',
      editId: 0, // Dibikin default 0 buat bedain dia edit data atau add data. Lebih jelasnya baca method confirm()
      dataProduk: new FormData(), // Buat nampung isi form
      editDataProduk: {}, // Buat nampung data yg mau diedit kalo ada
      form: {
        nama_produk: { value: '', type: '', message: '' },
        satuan: { value: '', type: '', message: '' },
        harga_jual: { value: '', type: '', message: '' },
        harga_beli: { value: '', type: '', message: '' },
        stok: { value: 0, type: '', message: '' },
        stok_minimum: { value: 0, type: '', message: '' },
        gambar: { value: '', type: '', message: '' },
      },
      snackbarMsg: '',
    }
  },
  methods: {
    btnUploadGambarClick() {
      this.$refs.inputFile.click()
    },
    previewImage(event) {
      // Reference to the DOM input element
      var input = event.target.files[0];
      this.form.gambar.value = input
      // Ensure that you have a file before attempting to read it
      if (input) {
        // create a new FileReader to read this image and convert to base64 format
        var reader = new FileReader();
        reader.readAsDataURL(input)
        // Define a callback function to run, when FileReader finishes its job
        reader.onload = (e) => {
          // Note: arrow function used here, so that "this.imageData" refers to the imageData of Vue component
          // Read image as base64 and set to imageData
          this.gambarProduk = e.target.result;
        }
        // Start the reader job - read file as a data url (base64 format)
        reader.readAsDataURL(input)
      }
    },
    getData(editId) {
      var uri = this.$api_baseUrl + "produk/" + editId

      this.$http.get(uri).then(response => {
        this.editDataProduk = response.data.value
        this.formEditHandler(this.editDataProduk) // this.editDataProduk yg isinya data dari db adalah param inputan untuk fungsi ini 
      })
    },
    formEditHandler(dataProduk) { // dataProduk disini bukan yg di data() vue tapi dari inputan param
      this.form.nama_produk.value = dataProduk.nama_produk
      this.form.satuan.value = dataProduk.satuan
      this.form.harga_jual.value = dataProduk.harga_jual
      this.form.harga_beli.value = dataProduk.harga_beli
      this.form.stok.value = parseInt(dataProduk.stok)
      this.form.stok_minimum.value = parseInt(dataProduk.stok_minimum)
      this.form.gambar.value = dataProduk.gambar

      // biar ngambil preview gambar produk yang ada di database
      this.gambarProduk = this.$api_baseUrl + 'produk/picture/' + dataProduk.gambar
    },
    clearError(form) {
      console.log(form)
      form.type = ''
      form.message = '' 
    },
    cekData() {
      let count = 0
      let regex = new RegExp(/^\d+$/)

      if(this.form.nama_produk.value === "") {
        this.form.nama_produk.type = 'is-danger'
        this.form.nama_produk.message = "Nama produk tidak boleh kosong!"
        count++
      }
      if(this.form.satuan.value === "") {
        this.form.satuan.type = 'is-danger'
        this.form.satuan.message = "Satuan tidak boleh kosong!"
        count++
      } 
      if(this.form.gambar.value === "") {
        this.form.gambar.type = 'is-danger'
        this.form.gambar.message = "Gambar tidak boleh kosong!"
        count++
      } 

      if(this.form.harga_beli.value === "") {
        this.form.harga_beli.type = 'is-danger'
        this.form.harga_beli.message = "Harga beli tidak boleh kosong!"
        count++
      } else if(!regex.test(this.form.harga_beli.value) || this.form.harga_beli.value < 1) {
        this.form.harga_beli.type = 'is-danger'
        this.form.harga_beli.message = "Harga beli tidak valid!"
        count++
      } 

      if(this.form.harga_jual.value === "") {
        this.form.harga_jual.type = 'is-danger'
        this.form.harga_jual.message = "Harga jual tidak boleh kosong!"
        count++
      } else if(!regex.test(this.form.harga_jual.value) || this.form.harga_jual.value < 1) {
        this.form.harga_jual.type = 'is-danger'
        this.form.harga_jual.message = "Harga jual tidak valid!"
        count++
      }
      if (this.form.harga_jual.value <= this.form.harga_beli.value) {
        this.form.harga_jual.type = 'is-danger'
        this.form.harga_jual.message = "Harga jual harus lebih besar dari harga beli!"
        count++
      }

      if(this.form.stok_minimum.value === "") {
        this.form.stok_minimum.type = 'is-danger'
        this.form.stok_minimum.message = "Stok minimum tidak boleh kosong!"
        count++
      } else if(!regex.test(this.form.stok_minimum.value) || this.form.stok_minimum.value < 0) {
        this.form.stok_minimum.type = 'is-danger'
        this.form.stok_minimum.message = "Stok minimum tidak valid!"
        count++
      } 

      if(this.form.stok.value === "") {
        this.form.stok.type = 'is-danger'
        this.form.stok.message = "Stok tidak boleh kosong!"
        count++
      } else if(!regex.test(this.form.stok.value) || this.form.stok.value < 0) {
        this.form.stok.type = 'is-danger'
        this.form.stok.message = "Stok tidak valid!"
        count++
      }

      if(count > 0)
        return false
    },
    addData() {
      this.isLoading = true // Biar dia loading dulu

      if(this.cekData() == false) {
        this.snackbar("Gagal tambah data. Sepertinya inputan salah...", 'is-danger')
      } else {
        this.dataProduk.append("nama_produk", this.form.nama_produk.value)
        this.dataProduk.append("satuan", this.form.satuan.value)
        this.dataProduk.append("harga_jual", this.form.harga_jual.value)
        this.dataProduk.append("harga_beli", this.form.harga_beli.value)
        this.dataProduk.append("stok", this.form.stok.value)
        this.dataProduk.append("stok_minimum", this.form.stok_minimum.value)
        this.dataProduk.append("gambar", this.form.gambar.value)
        this.dataProduk.append("pic", this.$session.get('pegawai').id_pegawai)

        var uri = this.$api_baseUrl + "produk";

        this.$http.post(uri, this.dataProduk).then(response => {
          this.$router.push( { name: 'Produk' } )
          this.snackbarMsg = response.message
          this.snackbar("Data berhasil ditambahkan!", 'is-success')
        })
        .catch(error => {
          this.errors = error;
          if (this.errors.message == "Request failed with status code 400") {
            this.snackbar("Gagal tambah data. Sepertinya inputan salah...", 'is-danger')
          } else {
            this.snackbar("Terjadi kesalahan. Silahkan coba lagi", 'is-danger')
          }
        })
      }
      this.isLoading = false // Biar berhenti loading
    },
    editData(editId) {
      this.isLoading = true // Biar dia loading dulu

      if(this.cekData() == false) {
        this.snackbar("Gagal tambah data. Sepertinya inputan salah...", 'is-danger')
      } else {
        this.dataProduk.append("nama_produk", this.form.nama_produk.value)
        this.dataProduk.append("satuan", this.form.satuan.value)
        this.dataProduk.append("harga_jual", this.form.harga_jual.value)
        this.dataProduk.append("harga_beli", this.form.harga_beli.value)
        this.dataProduk.append("stok", this.form.stok.value)
        this.dataProduk.append("stok_minimum", this.form.stok_minimum.value)
        if(typeof(this.form.gambar.value) != 'string') { // Kalo gak ganti gambar, isi this.form.gambar itu string. Kalo ganti gambar, jadi objek.
          this.dataProduk.append("gambar", this.form.gambar.value) // Jadi kalo dia masih string, dia gak akan ganti gambarnya
        }
        this.dataProduk.append("pic", this.$session.get('pegawai').id_pegawai)

        console.log(this.dataProduk)

        var uri = this.$api_baseUrl + "produk/" + editId;

        this.$http.post(uri, this.dataProduk, this.config).then(response => {
          this.$router.push( { name: 'Produk' } )
          this.snackbarMsg = response.message
          this.snackbar("Data berhasil diedit!", 'is-success')
        })
        .catch(error => {
          this.errors = error;
          if (this.errors.message == "Request failed with status code 400") {
            this.snackbar("Edit gagal. Sepertinya inputan salah...", 'is-danger')
          } else {
            this.snackbar("Terjadi kesalahan. Silahkan coba lagi", 'is-danger')
          }
        })
      }
      this.isLoading = false // Biar berhenti loading
    },
    confirm() {
      this.editId == 0 ? this.addData() : this.editData(this.editId)
    },
    snackbar(snackbarMessage, type) {
      this.$buefy.snackbar.open({
        duration: 5000,
        message: snackbarMessage,
        type: type,
        position: 'is-bottom-left',
        actionText: 'OK',
        queue: false,
      })
    },
  },
  watch: {
    gambar: function(o) {
      var reader = new FileReader();
      reader.onload = e => this.$emit("load", e.target.result);
      reader.readAsText(o[0]);
      alert();
    }
  },
  mounted() {
    if(this.$route.params.id) {           // Kalo di URL ada angka ID-nya,
      this.editId = this.$route.params.id // berarti ID-nya akan dimasukin ke editId
      this.actionTitle = 'Ubah'           // Title di atas jadi 'Ubah Data'
      this.getData(this.editId)           // Ngambil data lama sesuai ID
    } else {                      // Ini kalo gak ada param ID di URL
      this.actionTitle = 'Tambah' // berarti dia nambah data
    }
    this.isLoading = false // page udah ter-load dan berhenti loading
  }
}
</script>

<style scoped>
  .image-preview {
    margin-left: 135px;
  }
  img.preview {
    width: 200px;
    background-color: white;
    border: 1px solid #DDD;
    padding: 5px;
  }

</style>