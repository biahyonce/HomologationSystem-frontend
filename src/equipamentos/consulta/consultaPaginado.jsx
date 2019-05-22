import React, {Component} from 'react'
import ReactTable from "react-table";
import "react-table/react-table.css";
import {getToken} from '../../common/auth/auth'

class ConsultaPaginado extends Component {
    constructor(props) {
        super(props);
        
        // O estado "termo" define o filtro de busca
        this.state = {
            equipamentos: []
        };
    }

    componentWillMount() {
        // Faz um GET no endpoint que retorna os equipamentos paginados usando o token JWT salvo
        // Troquei o equipamentos/page por equipamentos/ (não vem paginado do spring)
        const BASE_URL = 'http://localhost:8080/equipamentos'
        const TOKEN_KEY = "SequenciaAssinarToken"
        
        fetch(`${BASE_URL}/`, {
            method: 'get',
            headers: {
                'Authorization': getToken()
            }
        })
        .then(response => response.json())
        .then(data => this.setState({equipamentos: data}));
    }
    
    filterCaseInsensitive (filter, row) {
        // Método que filtra os parâmetros da consulta ignorando case sensitive

        const id = filter.pivotId || filter.id;
        const content = row[id];

        if (typeof content !== 'undefined') {
            return String(content).toLowerCase().includes(filter.value.toLowerCase());
        }
    
        return true;
    };
    
    render() {
        // Cria const pra não usar "this.state" o tempo todo
        const {equipamentos, termo} = this.state;
        equipamentos && console.log(equipamentos)
        
        // Colunas da tabela
        const columns = [{
                Header: 'R12',
                accessor: 'r12',
            },{
                Header: 'Nome',
                accessor: 'nome'
            },{
                Header: 'Fabricante',
                accessor: 'fabricante'
            }, {
                Header: 'Descrição',
                accessor: 'descricao'
            },{
                Header: 'Status',
                accessor: 'status'
            }, {
                Header: 'Data',
                accessor: 'dataUltimaEdicao'
            }, {
                Header: '',
                acessor: 'editar',
                Cell: row => (
                    <span>
{/*                         <i className={`fa fa-pencil`}></i>
                        <i className={`fa fa-trash`}></i>
                        <i className={`fa fa-link`}></i> */}
                        <a style={{float : 'left', paddingRight : '25px', color: 'black'}}>
                            <i className={`fa fa-pencil`}/>
                        </a>

                        <a style={{float : 'left', paddingRight : '25px', color:'red' }}>
                            <i className={`fa fa-trash`}/>
                        </a>

                        <a style={{float : 'left', paddingRight : '25px'}}>
                            <i className={`fa fa-link`}/>
                        </a>
                    </span>
                  )
            }
        ]

        return(
            <div>
                <ReactTable 
                    data={equipamentos}
                    columns={columns}
                    defaultPageSize={10}
                    pageSizeOptins = {[3,6]}
                    filterable= {true}
                    defaultFilterMethod= {this.filterCaseInsensitive}
                />
            </div>
        );
    }
}

export default ConsultaPaginado