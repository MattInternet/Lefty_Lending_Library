import * as React from 'react';

import { inject, observer } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from 'libs';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, MenuItem, Select, FormHelperText } from '@material-ui/core';
import { UserLocation } from 'data/models/User';

export interface ILoginDialogProps {
    authStore?: any;
    classes?: any;
}

export interface IUserCreationInfo {
    preferredName: string;
    phone: string;
    location: UserLocation;
}

@inject('authStore')
@observer
class SignInDialog extends React.Component<ILoginDialogProps, IUserCreationInfo> {

    state = {
        preferredName: "",
        phone: "",
        location: UserLocation.NA
    }

    private handleFormSubmission = () =>{
        this.props.authStore.onFinalizeUserCreation(this.state);
    }

    private handlePreferredNameUpdate = (e: any) =>{
        this.setState({
            preferredName: e.target.value
        })
    }

    private handlePhoneUpdate = (e: any) =>{
        this.setState({
            phone: e.target.value
        })
    }

    private handleLocationUpdate = (e: any) =>{
        this.setState({
            location: e.target.value
        })
    }

    public render() {
        const {authStore} = this.props;
        const {
            uiConfig,
            displayLogin,
            toggleDisplayLogin,
            newUser,
            isAuthenticatedWithFirebase
        } = authStore;

        if(!isAuthenticatedWithFirebase){
            return (
                <Dialog open={displayLogin} onClose={toggleDisplayLogin}>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </Dialog>
            )
        }
        else if(!newUser){
            return null;
        }
        return (
                <Dialog open={newUser}>
                    <DialogTitle>User Information</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            In order to Lend (or Borrow) content from the LLL we need a bit of information. We'll never spam you! 🌹
                        </DialogContentText>
                        <TextField
                            autoFocus
                            id="preferred_name"
                            label="Preferred Name"
                            type="text"
                            onChange={this.handlePreferredNameUpdate}
                            fullWidth/>
                        <TextField
                            id="phone"
                            label="Phone"
                            type="tel"
                            onChange={this.handlePhoneUpdate}
                            fullWidth/>
                        
                        <Select
                            value={this.state.location}
                            id="location"
                            onChange={this.handleLocationUpdate}
                            fullWidth>
                            <MenuItem value={UserLocation["North Valley"]}>North Valley</MenuItem>
                            <MenuItem value={UserLocation["Central Valley"]}>Central Valley</MenuItem>
                            <MenuItem value={UserLocation["South Valley"]}>South Valley</MenuItem>
                            <MenuItem value={UserLocation["Logan"]}>Logan</MenuItem>
                            <MenuItem value={UserLocation["Park City"]}>Park City</MenuItem>
                        </Select>
                        <FormHelperText>Location</FormHelperText>
                    </DialogContent>
                    <DialogActions>
                        {/* TODO: Let them cancel... */}
                        {/* <Button onClick={this.handleClose} color="primary">
                        Cancel
                        </Button> */}
                        
                        <Button onClick={this.handleFormSubmission} color="primary">
                            Join 🤝🏻
                        </Button>
                    </DialogActions>
                </Dialog>
            )
    }
}

export default SignInDialog;