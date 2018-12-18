import * as React from 'react';

import { inject, observer } from 'mobx-react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth } from 'libs';
import {
    Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions,
    Button, MenuItem, Select, withStyles, InputLabel, FilledInput, FormControl
} from '@material-ui/core';
import { IUserCreationInfo } from 'state';
import { UserLocation } from 'data/enums';

export interface ILoginDialogProps {
    authStore?: any;
    classes?: any;
}

const styles = theme => ({
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

@inject('authStore')
@observer
class SignInDialog extends React.Component<ILoginDialogProps, IUserCreationInfo> {

    state = {
        preferredName: "",
        //preferredName: this.props.authStore.firebaseUser ? this.props.authStore.firebaseUser.displayName : "", //TODO: Would be cool to popualte it to displayName by default...
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
        const { classes, authStore } = this.props;
        const {
            uiConfig,
            displayLogin,
            toggleDisplayLogin,
            newUser,
            isAuthenticatedWithFirebase
        } = authStore;

        if (!isAuthenticatedWithFirebase) {
            return (
                <Dialog open={displayLogin} onClose={toggleDisplayLogin}>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </Dialog>
            )
        }
        else if (!newUser) {
            return null;
        }
        return (
            <Dialog open={newUser}>
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
                            <MenuItem value={UserLocation["North Valley"]}>North Valley</MenuItem>
                            <MenuItem value={UserLocation["Central Valley"]}>Central Valley</MenuItem>
                            <MenuItem value={UserLocation["South Valley"]}>South Valley</MenuItem>
                            <MenuItem value={UserLocation["Logan"]}>Logan</MenuItem>
                            <MenuItem value={UserLocation["Park City"]}>Park City</MenuItem>
                        </Select>
                        <InputLabel htmlFor="location-input-label">Location</InputLabel>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleFormSubmission} color="primary">
                        Join 🤝🏻
                        </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(SignInDialog);