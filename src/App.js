import React, { Component } from 'react';
import "semantic-ui-css/semantic.min.css";
import axios from 'axios';
import {
  Segment,
  Button,
  Icon,
  Container,
  Table,
  Grid,
  Form,
  Header,
  Input
} from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataApi: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: "",
      }
    }
    this.handleRemove = this.handleRemove.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
    this.getDataId = this.getDataId.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  reloadData() {
    axios.get('http://localhost:3004/data-karyawan').then(res => {
      this.setState({
        dataApi: res.data,
        edit: false
      })
    }
    );
  }

  clearData = () => {
    let newDataPost = { ...this.state.dataPost };

    newDataPost['id'] = "";
    newDataPost['nama_karyawan'] = "";
    newDataPost['jabatan'] = "";
    newDataPost['jenis_kelamin'] = "";
    newDataPost['tanggal_lahir'] = "";

    this.setState({
      dataPost: newDataPost
    })
  }

  inputChange(e) {
    let newDataPost = { ...this.state.dataPost };

    if (this.state.edit === false) {
      newDataPost['id'] = new Date().getTime();
    }

    newDataPost[e.target.name] = e.target.value

    this.setState({
      dataPost: newDataPost
    }, () => console.log(this.state.dataPost))
  }

  onSubmitForm = () => {
    if (this.state.edit === false) {
      axios.post('http://localhost:3004/data-karyawan', this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        })
    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`, this.state.dataPost)
        .then(() => {
          this.reloadData();
          this.clearData();
        }
        )
    }
  }

  getDataId = (e) => {
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`)
      .then(res => {
        this.setState({
          dataPost: res.data,
          edit: true
        })
      })
  }

  handleRemove(e) {

    axios.delete(`http://localhost:3004/data-karyawan/${e.target.value}`)
      .then(() => { this.reloadData() })
  }


  componentDidMount() {
    this.reloadData();

  }

  render() {
    return (
      <div>
        <br />
        <Grid container textAlign="center">
          <Grid.Column width={6} >
            <Segment stacked>

              <Form>
                <Header as='h2' color="teal">Pendaftaran Karyawan
                </Header>
                <Form.Field>
                  <Input name="nama_karyawan" placeholder='Masukan Nama Karyawan' onChange={this.inputChange} value={this.state.dataPost.nama_karyawan} />
                </Form.Field>
                <Form.Field>
                  <Input name="jabatan" placeholder='Masukan Jabatan' onChange={this.inputChange} value={this.state.dataPost.jabatan} />
                </Form.Field>
                <Form.Field>
                  <Input name="jenis_kelamin" placeholder='Jenis Kelamin' onChange={this.inputChange} value={this.state.dataPost.jenis_kelamin} />
                </Form.Field>
                <Form.Field>
                  <Input name="tanggal_lahir" type="date" onChange={this.inputChange} value={this.state.dataPost.tanggal_lahir} />
                </Form.Field>

                <Button fluid color="teal" icon type='submit' labelPosition='left' onClick={this.onSubmitForm}><Icon name='save' />Simpan</Button>
              </Form>

            </Segment>
          </Grid.Column>
        </Grid>
        <br />

        <Container>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan='5'><h3>Table Karyawan</h3></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Nama</Table.HeaderCell>
                <Table.HeaderCell>Jabatan</Table.HeaderCell>
                <Table.HeaderCell>Jenis Kelamin</Table.HeaderCell>
                <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
                <Table.HeaderCell>Aksi</Table.HeaderCell>
              </Table.Row>
            </Table.Header>


            <Table.Body>
              {this.state.dataApi.map((dat, index) => {
                return (
                  <Table.Row key={index} >
                    <Table.Cell>{dat.nama_karyawan}</Table.Cell>
                    <Table.Cell>{dat.jabatan}</Table.Cell>
                    <Table.Cell>{dat.jenis_kelamin}</Table.Cell>
                    <Table.Cell>{dat.tanggal_lahir}</Table.Cell>
                    <Table.Cell>
                      <Button.Group>
                        <Button value={dat.id} onClick={this.getDataId} icon color="yellow">
                          <Icon name='edit' />
                        </Button>
                        <Button value={dat.id} onClick={this.handleRemove} icon color="red">
                          <Icon name='trash' />
                        </Button>
                      </Button.Group>
                    </Table.Cell>
                  </Table.Row>
                )
              })}

            </Table.Body>

            <Table.Footer>
              <Table.Row>
                <Table.HeaderCell>Nama</Table.HeaderCell>
                <Table.HeaderCell>Jabatan</Table.HeaderCell>
                <Table.HeaderCell>Jenis Kelamin</Table.HeaderCell>
                <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
                <Table.HeaderCell>Aksi</Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Container>

      </div>
    )
  }
}
export default App;
