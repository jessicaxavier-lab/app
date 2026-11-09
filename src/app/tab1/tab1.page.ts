import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, 
  IonSearchbar, IonList, IonItem, IonAvatar, 
  IonLabel, IonIcon, IonButton, IonFab, 
  IonFabButton, IonModal, IonButtons, IonInput, 
  IonSelect, IonSelectOption, IonToast, AlertController 
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, callOutline, star, 
  starOutline, createOutline, trashOutline, 
  add, arrowBack, personOutline, mailOutline, 
  pricetagOutline, saveOutline 
} from 'ionicons/icons';

export interface Contato {
  id: number;
  nome: string;
  telefone: string;
  email?: string;
  categoria?: string;
  favorito: boolean;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonSearchbar, IonList, IonItem, IonAvatar,
    IonLabel, IonIcon, IonButton, IonFab,
    IonFabButton, IonModal, IonButtons, IonInput,
    IonSelect, IonSelectOption, IonToast
  ]
})
export class Tab1Page implements OnInit {
  
  contatos: Contato[] = [];
  contatosFiltrados: Contato[] = [];
  termoBusca: string = '';

  isModalOpen: boolean = false;
  isEditMode: boolean = false;

  idEdicao: number | null = null;
  nomeInput: string = '';
  telefoneInput: string = '';
  emailInput: string = '';
  categoriaInput: string = 'Geral';

  mensagemToast: string = '';
  isToastOpen: boolean = false;

  constructor(private alertController: AlertController) {
    addIcons({
      'person-circle-outline': personCircleOutline,
      'call-outline': callOutline,
      'star': star,
      'star-outline': starOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'add': add,
      'arrow-back': arrowBack,
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'pricetag-outline': pricetagOutline,
      'save-outline': saveOutline
    });
  }

  ngOnInit() {
    this.carregarContatos();
  }

  carregarContatos() {
    const dados = localStorage.getItem('contatos');
    if (dados) {
      this.contatos = JSON.parse(dados);
    } else {
      this.contatos = [];
    }
    this.filtrarContatos();
  }

  salvarNoLocalStorage() {
    localStorage.setItem('contatos', JSON.stringify(this.contatos));
    this.filtrarContatos();
  }

  filtrarContatos() {
    if (!this.termoBusca.trim()) {
      this.contatosFiltrados = [...this.contatos];
    } else {
      this.contatosFiltrados = this.contatos.filter(c => 
        c.nome.toLowerCase().includes(this.termoBusca.toLowerCase())
      );
    }
  }

  abrirNovoContato() {
    this.isEditMode = false;
    this.idEdicao = null;
    this.nomeInput = '';
    this.telefoneInput = '';
    this.emailInput = '';
    this.categoriaInput = 'Geral';
    this.isModalOpen = true;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

  salvarContato() {
    if (!this.nomeInput || this.nomeInput.trim().length < 3) {
      this.exibirToast('Digite um nome válido (mínimo 3 caracteres).');
      return;
    }

    if (!this.telefoneInput || this.telefoneInput.length < 8) {
      this.exibirToast('Digite um telefone válido.');
      return;
    }

    if (this.isEditMode && this.idEdicao !== null) {
      const index = this.contatos.findIndex(c => c.id === this.idEdicao);
      if (index !== -1) {
        this.contatos[index] = {
          ...this.contatos[index],
          nome: this.nomeInput,
          telefone: this.telefoneInput,
          email: this.emailInput,
          categoria: this.categoriaInput
        };
      }
      this.exibirToast('Contato atualizado com sucesso!');
    } else {
      const novo: Contato = {
        id: new Date().getTime(),
        nome: this.nomeInput,
        telefone: this.telefoneInput,
        email: this.emailInput,
        categoria: this.categoriaInput,
        favorito: false
      };
      this.contatos.push(novo);
      this.exibirToast('Contato cadastrado com sucesso!');
    }

    this.salvarNoLocalStorage();
    this.fecharModal();
  }

  editarContato(contato: Contato) {
    this.isEditMode = true;
    this.idEdicao = contato.id;
    this.nomeInput = contato.nome;
    this.telefoneInput = contato.telefone;
    this.emailInput = contato.email || '';
    this.categoriaInput = contato.categoria || 'Geral';
    this.isModalOpen = true;
  }

  async excluirContato(id: number) {
    const alert = await this.alertController.create({
      header: 'Excluir Contato',
      message: 'Deseja realmente excluir este contato da sua agenda?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          role: 'destructive',
          handler: () => {
            this.contatos = this.contatos.filter(c => c.id !== id);
            this.salvarNoLocalStorage();
            this.exibirToast('Contato excluído com sucesso!');
          }
        }
      ]
    });
    await alert.present();
  }

  alternarFavorito(contato: Contato) {
    contato.favorito = !contato.favorito;
    this.salvarNoLocalStorage();
  }

  async ligar(contato: Contato) {
    const alert = await this.alertController.create({
      header: 'Chamada',
      message: `Ligando para ${contato.nome} (${contato.telefone})...`,
      buttons: ['OK']
    });
    await alert.present();
  }

  exibirToast(mensagem: string) {
    this.mensagemToast = mensagem;
    this.isToastOpen = true;
  }
}