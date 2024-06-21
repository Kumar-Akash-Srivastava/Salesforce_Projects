import { LightningElement } from 'lwc';
import getTrainInfo from '@salesforce/apex/TrainInfoClass.getTrainInfo';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

const columns = [
    {label: 'Station Name', fieldName: 'station_name'},
    {label: 'Distance', fieldName : 'distance'},
    {label: 'Halt', fieldName : 'halt'},
    {label: 'Delay', fieldName : 'delay'},
    {label: 'Platform', fieldName : 'platform'},
    {label: 'Timing', fieldName : 'timing'},
];


export default class TrainInfoClass extends LightningElement {

    inputTrainNo = '';
    showSpinner = false;
    showTrainDetails = false;
    trainDetails = {};
    columns = columns;

    handleInputChange(event) {
        this.inputTrainNo = event.detail.value;
    }

    handleTrainInfo() {
        this.showSpinner = true;
        this.showTrainDetails = false;
        getTrainInfo({trainNo: this.inputTrainNo})
        .then((result) => {
            this.showSpinner = false;
            if(Object.keys(result).length > 0){
                this.showTrainDetails = true;
                this.trainDetails = result;
                console.log('trainDetails '+JSON.stringify(this.trainDetails));
            }
            else{
                const event = new ShowToastEvent({
                    title: 'Invalid Train Number',
                    message: 'No trains exist with train number '+this.inputTrainNo,
                    variant:'error',
                    mode: 'dismissable'
                });
                this.dispatchEvent(event);
            }
        })
        .catch((error) => {
            this.showTrainDetails = false;
            console.log('I am sorry, but I am unable to fulfill your request' +JSON.stringify(error));
        });
    }
}