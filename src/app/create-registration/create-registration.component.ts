import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit {
  public packages: string[] = ["Monthly", "Quarterly", "Yearly"]
  public genders: string[] = ["Male", "Female"]
  public importantList: string[] = [
    "Toxic fat reduction",
    "Energy and Endurance",
    "Building lean muscle",
    "Healthier digestive system",
    "Sugar craving body",
    "fitness"
  ];
  public registerForm!: FormGroup;
  public userIdToUpdate!: number
  public isUpdateActive: boolean = false

  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private api: ApiService,
  private toastService: NgToastService){  }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      contact: [''],
      weight: [''],
      height: [''],
      gender: [''],
      requireTrainer: [''],
      package: [''],
      important: [''],
      haveGymBefore: [''],
      enquiryDate: [''],
      bmi: [''],
      bmiResult: ['']
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res => {
      this.calculateBmi(res)
    })
    this.activatedRoute.params.subscribe(val => {
      this.userIdToUpdate = val['id']
      this.api.getRegisteredUserId(this.userIdToUpdate).subscribe(res => {
        this.isUpdateActive = true
        this.fillFormToUpdate(res)
      })
    })
  }
  submit(){
    this.api.postRegistration(this.registerForm.value).subscribe(res => {
      this.toastService.success({detail: "success", summary: "Enquiry Added", duration: 3000})
      this.registerForm.reset()
    })
  }
  update(){
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate).subscribe(res => {
      this.toastService.success({detail: "success", summary: "Enquiry Updated", duration: 3000})
      this.registerForm.reset()
      this.router.navigate(['list'])
    }) 
  }
  calculateBmi(heightValue: number){
    const weight = this.registerForm.value.height
    const height = heightValue
    const bmi = weight / (height * height)
    this.registerForm.controls['bmi'].patchValue('bmi')
    switch (true) {
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("Under Weight")
        break;
      case (bmi >= 18.5 && bmi < 25):
          this.registerForm.controls['bmiResult'].patchValue("Great Shape")
          break;
      case (bmi >= 25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("Over Weight")
        break;    
      default:
        this.registerForm.controls['bmiResult'].patchValue("Hello form BMI AI")
        break;
    }
  }
  fillFormToUpdate(user: User){
    this.registerForm.setValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      contact: user.contact,
      weight: user.weight,
      height: user.height,
      bmi: user.bmi,
      bmiResult: user.bmiResult,
      gender: user.gender,
      requireTrainer: user.requireTrainer,
      package: user.package,
      important: user.important,
      haveGymBefore: user.haveGymBefore,
      enquiryDate: user.enquiryDate
    })
  }
}
