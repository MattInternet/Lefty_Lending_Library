import * as React from 'react';

import { inject, observer } from 'mobx-react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, FormControl, Select, FilledInput, MenuItem, InputLabel, DialogActions, Button, withMobileDialog, withStyles } from '@material-ui/core';
import { UserLocation } from 'data/enums';


import {  IUserCreationInfo } from 'common';

const styles: any = theme => ({
    fieldInput: {
        margin: theme.spacing.unit,
        minWidth: 300,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 300
    },
    userInfoDialog:{
        maxWidth: 300
    }

});

interface ISignInDialogProps {
    authStore?: any;
    classes?: any;
    fullScreen?: any;
}

@inject('authStore')
@observer
class UserInfoDialog extends React.Component<ISignInDialogProps, IUserCreationInfo> {

    state = {
        preferredName: "",
        phone: "",
        location: UserLocation.NA,
        nameError: false,
        locationError: false,
        phoneError: false
    }

    private handleFormSubmission = () => {
        if(!this.validateForm()){
            return;
        }
        this.props.authStore.onFinalizeUserCreation(this.state);
    }

    private validateForm = ():boolean => {
        let valid:boolean = true;
        if(this.state.preferredName === ""){
            valid = false;
            this.setState({
                nameError: true
            })
        }
        if(this.state.location === UserLocation.NA){
            valid = false;
            this.setState({
                locationError: true
            })
        }
        if(this.state.phone === ""){
            valid = false;
            this.setState({
                phoneError: true
            })
        }

        return valid;
    }

    private handleChange = (field: string) => (event) => {
        this.setState({ [field]: event.target.value } as Pick<IUserCreationInfo, any>);
    };

    public render() {
        const { classes, authStore, fullScreen } = this.props;
        const {
            newUser,
        } = authStore;

        return(
        <Dialog open={newUser} fullScreen={fullScreen}>
            <DialogTitle>User Information</DialogTitle>
            <DialogContent className={classes.userInfoDialog}>
                <DialogContentText>
                    In order to Lend (or Borrow) content from the LLL we need a bit of information. We'll never spam you! 🌹
                </DialogContentText>
                <TextField
                    error={this.state.nameError}
                    className={classes.fieldInput}
                    autoFocus
                    id="preferred_name_input"
                    label="Preferred Name"
                    type="text"
                    onChange={this.handleChange('preferredName')}
                    margin="normal"
                    variant="filled" />
                <TextField
                    error={this.state.phoneError}
                    className={classes.fieldInput}
                    id="phone_input"
                    label="Phone"
                    type="tel"
                    onChange={this.handleChange('phone')}
                    margin="normal"
                    variant="filled" />
                <FormControl variant="filled" className={classes.formControl}>
                    <Select
                        error={this.state.locationError}
                        value={this.state.location}
                        id="location_input"
                        onChange={this.handleChange('location')}
                        input={<FilledInput name="Location" id="location-input-label" />}
                        fullWidth>
                        <MenuItem value= {UserLocation.North_Valley}>{UserLocation.North_Valley}</MenuItem>
                        <MenuItem value= {UserLocation.Central_Valley}>{UserLocation.Central_Valley}</MenuItem>
                        <MenuItem value= {UserLocation.South_Valley}>{UserLocation.South_Valley}</MenuItem>
                        <MenuItem value= {UserLocation.Logan}>{UserLocation.Logan}</MenuItem>
                        <MenuItem value= {UserLocation.Park_City}>{UserLocation.Park_City}</MenuItem>
                    </Select>
                    <InputLabel htmlFor="location-input-label">Location</InputLabel>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleFormSubmission} color="primary">
                    🌹 Join 🤝🏻
                    </Button>
            </DialogActions>
        </Dialog>
        );
    }
}

export default withMobileDialog()(withStyles(styles)(UserInfoDialog));