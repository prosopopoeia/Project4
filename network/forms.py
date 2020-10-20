from django import forms


class NewPostForm(forms.Form):
    post_subject = forms.CharField(label='Subject', widget=forms.TextInput(attrs={"id":"sub"}), max_length=1000)
    post_body = forms.CharField(
        label='Body', 
        widget=forms.Textarea(attrs={"rows":14, "cols":120, "id": "bod"}), 
        max_length=1000)
        
